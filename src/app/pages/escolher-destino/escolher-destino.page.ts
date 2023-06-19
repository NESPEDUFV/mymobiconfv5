import { ViewChild, ElementRef, Component } from '@angular/core';
import Graph from 'graphology';
import { dijkstra } from 'graphology-shortest-path';
import { NavController } from '@ionic/angular';
import { CallbackID, Geolocation, Position } from '@capacitor/geolocation';
import { ToastService } from 'src/app/services/toast.service';
import { ACCESS_NODE_ICON, DEFAULT_LINE_STYLE, DEFAULT_NODE_ICON, DESTINATION_MARKER_IMAGE_PATH, FeatureColletion, MAP_ID, MapaService, USER_MARKER_IMAGE_PATH } from 'src/app/services/localizacao/mapa.service';
import { LocalizacaoService, Node, Edge } from 'src/app/services/localizacao/localizacao.service';
import {} from 'google-maps';

declare var google: any;

@Component({
  selector: 'app-localizacao',
  templateUrl: 'escolher-destino.page.html',
  styleUrls: ['escolher-destino.page.scss'],
})
export class EscolherDestinoPage {
  /*Mapa*/
  map: google.maps.Map;
  @ViewChild('map', {read: ElementRef, static: false})
  mapRef: ElementRef = {} as ElementRef;
  
  /*Variáveis*/
  devicePosition: Node; 
  destination: Node;
  destinationMarkers: google.maps.Marker[];
  isMessageVisible: boolean = false; 
  isPermissionMessageVisible: boolean = false;
  isGpsMessageVisible: boolean = false;
  isLeavingFromNavigationScreen: boolean = false; 
  isCardVisible: boolean = false; 
  floorCount: number = 0;
  selectedFloor: number = 1;
  lastSelectedFloor: number = 0;
  userFloor: number = 1;
  distance: number = 0;
  currentPositionMarker: google.maps.Marker;  
  geolocationStream: CallbackID = null;
  route: string[];
  routePoints: google.maps.Marker[] = [];
  routeLine: google.maps.Polyline;
  mapGraph = new Graph<Node, Edge>({
    multi: true
  });

  constructor(
    public navCtrl: NavController,
    private toast: ToastService,
    private mapa: MapaService,
    private localizacao: LocalizacaoService
  ) {}
  
  ionViewDidEnter(): void {
    this.handlePageInit();
  }

  async handlePageInit(): Promise<void> {
    if(this.isLeavingFromNavigationScreen){
      /*
        Maneira de alternar entre monitoramento de posição da página
        "escolher-destino" para a página "navegação".
        Não é possível manter as duas páginas monitorando pois, além
        de desperdiçar dados móveis provoca inúmeros bugs
      */
      await this.watchPosition();
      this.isLeavingFromNavigationScreen = false;
      return;
    }

    //Fluxo normal de início da página...
    const isPermissionsGranted = await this.localizacao.handleGeolocationPermission().catch(e => {
      this.isGpsMessageVisible = true;
      this.toast.showMessage('Localização desativada', 'danger');
    });
    const isGpsDisabled = this.isGpsMessageVisible;
    if(isGpsDisabled) return;
    if(!isPermissionsGranted){
      this.isPermissionMessageVisible = true;
      return;
    }

    await this.loadMap();
    this.floorCount = this.getFloorCount();
    await this.getUserPosition(); 
    this.showMap(); 
    this.handleDestinationMarkers();
    this.handleUserMarker();
    this.watchPosition();
  }

  async loadMap(): Promise<void> {
    const jsonMap: FeatureColletion = await fetch('assets/json/localizacao/len.geojson').then(response => response.json());
    // const jsonMap: FeatureColletion = await fetch('assets/json/localizacao/casa.geojson').then(response => response.json());
    // const jsonMap: FeatureColletion = await fetch('assets/json/localizacao/pve.geojson').then(response => response.json());
    this.mapGraph = this.mapa.mountGraph(jsonMap);
  }

  getFloorCount(): number {
    let floorCount = 1;
    this.mapGraph.forEachNode((label, attributes: Node) => {
      if(attributes.floor > floorCount){
        floorCount = attributes.floor;
      }
    });
    return floorCount;
  }

  async getUserPosition() : Promise<void> {
    let devicePosition = await this.localizacao.getPositionFromDevice();

    // const nodes = this.getNodesByFloor(this.selectedFloor);
    devicePosition.floor = this.userFloor;
    const isUserOnBuilding: boolean = this.checkUserIsOnBuilding(devicePosition);
    if(!isUserOnBuilding){
      this.setMessageVisible();
      this.devicePosition = devicePosition;
      return;
    }
    this.devicePosition = this.localizacao.getNearestNode(devicePosition, this.getNodesByFloor(devicePosition.floor));
  }

  checkUserIsOnBuilding(position: Node): boolean {
    const nearestNode = this.localizacao.getNearestNode(position, this.getAllGraphNodes());
    const distanceFromNearestNode = this.localizacao.getDistanceBetweenPoints(position.coordinates, nearestNode.coordinates);
    const DISTANCE_FROM_ANY_NODE_LIMIT = 7;
    if(distanceFromNearestNode > DISTANCE_FROM_ANY_NODE_LIMIT) 
      return false;
    return true;
  }

  showMap(): void {
    const latLng = new google.maps.LatLng(this.devicePosition.coordinates.lat, this.devicePosition.coordinates.long);
    const options = {
      center: latLng,
      zoom: 100,
      disableDefaultUI: true,
      vectorRendering: 'auto', 
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapId: MAP_ID
    };
    this.map = new google.maps.Map(
      this.mapRef.nativeElement, 
      options
    );
  }

  handleDestinationMarkers(): void {
    if(this.lastSelectedFloor == this.selectedFloor) return;

    this.removeDestinations();
    const destinations = this.getDestinationNodes();
    this.lastSelectedFloor = Number(this.selectedFloor);    
    
    let markers: google.maps.Marker[] = [];
    destinations.forEach(node => {
      const icon = {
        url: DESTINATION_MARKER_IMAGE_PATH,
        scaledSize: new google.maps.Size(45, 45)
      };
      const position = new google.maps.LatLng(node.coordinates.lat, node.coordinates.long);
      const mapMarker = new google.maps.Marker({
        position: position,
        map: this.map,
        title: node.label,
        latitude: node.coordinates.lat,
        longitude: node.coordinates.long,
        icon: icon
      });
      mapMarker.setMap(this.map);
      this.addMarkerBehaviour(mapMarker, node);    
      markers.push(mapMarker);
    });
    this.destinationMarkers = markers;
  }

  removeDestinations(): void {
    if(!this.destinationMarkers) return;
    this.destinationMarkers.forEach(point => point.setMap(null));
    this.destinationMarkers = [];
  }

  getDestinationNodes(): Node[] {
    const destinations: Node[] = []; 
    this.mapGraph.forEachNode((label, attributes) => {
      if(attributes.floor != this.selectedFloor) return;
      if(!attributes.isDestination) return;
      return destinations.push(attributes);
    });
    return destinations;
  }

  async handleFloorChanges(): Promise<void> {
    this.handleDestinationMarkers();
    await this.restartGeolocationStream();
  }

  async handleUserFloorChanges(): Promise<void> {
    await this.restartGeolocationStream();
  }

  async restartGeolocationStream(): Promise<void> {
    const isStreamRunning = Boolean(this.geolocationStream);
    if (isStreamRunning)
      await this.clearGeolocationStream();
    
    await this.watchPosition();
  }

  addMarkerBehaviour(marker: google.maps.Marker, node: Node): void {
    marker.addListener('click', ()=> {
      this.showCard();
      this.destination = node;
      this.handleRoute();
    });
  }

  showCard = () => this.isCardVisible = true;

  handleUserMarker(): void {
    const latLng = new google.maps.LatLng(this.devicePosition.coordinates.lat, this.devicePosition.coordinates.long);
    const isMarkerSetted = Boolean(this.currentPositionMarker);
    const isMarkerVisible = this.devicePosition.floor == this.selectedFloor;
    if(!isMarkerVisible){
      if(isMarkerSetted)
        this.currentPositionMarker.setMap(null);
      this.currentPositionMarker = undefined;
      return;
    }
    if(isMarkerSetted){
      this.currentPositionMarker.setPosition(latLng);
      return;
    }

    const icon = {
      url: USER_MARKER_IMAGE_PATH,
      scaledSize: new google.maps.Size(60, 60),
    };
    this.currentPositionMarker = new google.maps.Marker({
      position: latLng,
      map: this.map,
      title: 'Você',
      snippet: 'Você',
      icon: icon,
    });
    this.map.setCenter(latLng);
  }

  async watchPosition() : Promise<void> {
    const isStreamRunning = Boolean(this.geolocationStream); 
    if (isStreamRunning) {
      return;
    }
    const options = {
      maximumAge: 5000,
      enableHighAccuracy: true,
      timeout: 3000
    }
    this.geolocationStream = await Geolocation.watchPosition(
      options,
      async (pos: Position, posError?: any) => {
        const hasError = posError || !pos.coords;
        if(hasError) return;
        const deviceNode = {
          label: 'device',
          coordinates: {
            lat: pos.coords.latitude,
            long: pos.coords.longitude
          },
          isDestination: false,
          floor: this.userFloor
        } as Node
        

        const isUserOnBuilding: boolean = this.checkUserIsOnBuilding(deviceNode);
        
        if(!isUserOnBuilding){
          this.devicePosition = deviceNode;
          this.handleUserMarker();
          this.handleRoute();
          return;
        }

        const nodes = this.getNodesByFloor(deviceNode.floor);
        const nearestNode = this.localizacao.getNearestNode(deviceNode, nodes);
        this.devicePosition = nearestNode;
        this.handleRoute();
        this.handleUserMarker();
      }
    );
  }

  getAllGraphNodes = () => this.mapGraph.mapNodes((label, attributes) => attributes);

  getNodesByFloor = (floor: number) => {
    let nodes: Node[] = [];

    this.mapGraph.mapNodes((label, attributes) => {
      if(attributes.floor == floor)
        nodes.push(attributes);
    });

    return nodes
  }

  handleRoute(): void {
    const isStartAndDestinationPointsFilled = this.devicePosition && this.destination;
    if(!isStartAndDestinationPointsFilled) return;
    
    const isRouteFilled = Boolean(this.route);
    if(isRouteFilled){
      const isStartPositionTheSame  = this.localizacao.isPointsTheSame((this.mapGraph.getNodeAttributes(this.route[0])).coordinates, this.devicePosition.coordinates);
      const isDestinationTheSame = this.localizacao.isPointsTheSame((this.mapGraph.getNodeAttributes(this.route[this.route.length - 1])).coordinates, this.destination.coordinates);
      const routeNotChanged = isStartPositionTheSame && isDestinationTheSame;
      if(routeNotChanged && !isStartAndDestinationPointsFilled) return;
    }
    
    const isRouteOnMap = this.routeLine && this.routePoints;
    if(isRouteOnMap)
      this.removeRoute();
    
    const isUserOnBuilding = this.checkUserIsOnBuilding(this.devicePosition);
    if(!isUserOnBuilding){
      this.toast.showMessage('Não existe uma rota para o destino selecionado. Vá para dentro do edifício e tente novamente', 'danger', 5000);
      return;
    }
    
    this.route = dijkstra.bidirectional(
      this.mapGraph,
      this.devicePosition.label,
      this.destination.label,
      "distance"
    );
    this.distance = this.localizacao.getPathDistance(this.route.map(label => this.mapGraph.getNodeAttributes(label)));
    this.addRoute();
  }

  removeRoute(): void {
    this.routePoints.forEach(point => point.setMap(null));
    this.routePoints = [];
    this.routeLine.setMap(null);
    this.routeLine = undefined;
  }

  addRoute(): void {
    this.addRouteMarkers();
    this.addRouteLine();
  }

  addRouteMarkers(): void {
    this.route.forEach(label => {
      const node = this.mapGraph.getNodeAttributes(label);
      if(node.isDestination) return;
      if(node.floor != this.selectedFloor) return;
      const position = new google.maps.LatLng(node.coordinates.lat, node.coordinates.long);
      const icon = node.isAccessNode ? ACCESS_NODE_ICON : DEFAULT_NODE_ICON;
      const mapMarker = new google.maps.Marker({
        position: position,
        map: this.map,
        title: node.label,
        latitude: node.coordinates.lat,
        longitude: node.coordinates.long,
        icon: icon
      });
      this.routePoints.push(mapMarker);
      mapMarker.setMap(this.map);
    });
  }

  addRouteLine(): void {
    const selectedFloorPoints = this.route.filter(label => this.mapGraph.getNodeAttributes(label).floor == this.selectedFloor);
    const points = selectedFloorPoints.map(label => {
      const node = this.mapGraph.getNodeAttributes(label);
      return new google.maps.LatLng(node.coordinates.lat, node.coordinates.long);
    });
    const line = new google.maps.Polyline({
      path: points,
      ...DEFAULT_LINE_STYLE
    });
    this.routeLine = line;
    line.setMap(this.map);
  }

  async goToNavigationPage(): Promise<void> {
    const isRouteEmpty = !Boolean(this.route);
    if(isRouteEmpty){
      this.toast.showMessage('Não é possível iniciar a navegação sem um rota traçada. Vá para dentro do edifício e tente novamente', 'danger', 5000);
      return;
    }
    
    const route = this.route.map(label => this.mapGraph.getNodeAttributes(label));
    await this.clearGeolocationStream();
    this.isLeavingFromNavigationScreen = true;
    this.navCtrl.navigateForward(
      'navegacao', 
      {
        queryParams: {
          route: route
        }
      }
    );
  }

  reCenter(): void {
    const latLng = new google.maps.LatLng(this.devicePosition.coordinates.lat, this.devicePosition.coordinates.long);
    this.map.setCenter(latLng);
    this.map.setZoom(100);
  }

  generateFloorOptions(): number[] {
    return Array.from({ length: this.floorCount }, (_, index) => index + 1);
  }

  setMessageVisible = () => this.isMessageVisible = !this.isMessageVisible;

  handlePermissionDismissButton = () => {
    this.isPermissionMessageVisible = false;
    this.handlePageInit();
  }

  handleGpsDismissButton = () => {
    this.isGpsMessageVisible = false;
    this.handlePageInit();
  }

  hideCard = () => this.isCardVisible = false;

  goBack = () => this.navCtrl.pop();

  async ionViewWillLeave(): Promise<void> {
    await this.clearGeolocationStream();
  }

  async clearGeolocationStream(): Promise<void> {
    const options = {
      id: this.geolocationStream
    };
    await Geolocation.clearWatch(options);
    this.geolocationStream = null;
  }
}