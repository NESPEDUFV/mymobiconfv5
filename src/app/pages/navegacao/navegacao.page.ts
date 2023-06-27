import { Component } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CallbackID, Geolocation, Position } from '@capacitor/geolocation';
import { AccelListenerEvent, Motion } from '@capacitor/motion';
import { NavController, Platform } from '@ionic/angular';
import { ToastService } from 'src/app/services/toast.service';
import { ACCESS_NODE_INSTRUCTION_IMAGE_PATH, DEFAULT_INSTRUCTION_IMAGE_PATH, FLOOR_TRANSITION_INSTRUCTION_IMAGE_PATH, GPS_ACCURACY_LIMIT_IN_METERS, LocalizacaoService, Node, STEP_SIZE_IN_METERS, STEP_THRESHOLD, SUCCESS_INSTRUCTION_IMAGE_PATH } from 'src/app/services/localizacao/localizacao.service';
import { ACCESS_NODE_ICON, DEFAULT_LINE_STYLE, DEFAULT_NODE_ICON, NAVIGATION_DESTINATION_IMAGE_PATH, NAVIGATION_MARKER_IMAGE_PATH, MAP_ID } from 'src/app/services/localizacao/mapa.service';
import {} from 'google-maps';

declare var google: any;

@Component({
  selector: 'app-localizacao',
  templateUrl: 'navegacao.page.html',
  styleUrls: ['navegacao.page.scss'],
})
export class NavegacaoPage {
  /*Mapa*/
  map: google.maps.Map;
  @ViewChild('map', {read: ElementRef, static: false})
  mapRef: ElementRef = {} as ElementRef;

  /*
    Usado para anular os streams do plugin "Motion". 
    Aparentemente ao utilizar o "removeListeners" do plugin,
    os streams não iniciam novamente para um possível novo uso
    do sistema de navegação portanto foi necessário utilizar
    uma variável de controle.

    Além disso também é usado para parar a recursão do algoritmo
    de monitoramento da posição do gps "watchPosition"
  */
  isStreamEnabled: boolean = true;

  /*Variáveis da página*/
  isStreamPaused: boolean = false;
  currentPositionMarker: google.maps.Marker;
  currentDirectionInDegrees: number;  
  geolocationStream: CallbackID = null;
  steps: number = 0;
  floor: number = 1;
  currentFloorNodes: Node[];  
  nextFloor: number;
  distance: number = 0;
  destination: Node;
  sensorsCurrentNode: Node;
  lastValidPosition: Node;
  lastMarkerPosition: Node;
  isMessageVisible: boolean = false;
  isFloorMessageVisible: boolean = false; 
  isSuccessMessageVisible: boolean = false;   
  instructionTitle: string;
  instructionDescription: string = '';
  currentInstructionImage: string = '';
  title: string = '' ;
  route: Node[];
  currentRouteMarkers: google.maps.Marker[] = [];
  currentRouteLine: google.maps.Polyline;
  incorrectPositionCount: number = 0;
  // orientationStream: any = null;
  // accelerationStream: any = null;

  constructor(
    private routeParams: ActivatedRoute,
    public navCtrl: NavController,
    private platform: Platform,
    private toast: ToastService,
    private localizacao: LocalizacaoService,
  ) {}

  async ionViewDidEnter(): Promise<void> {
    this.setAndroidBackButtonAction();
    this.getDataFromRoute();
    this.handlePageInit();
  }

  setAndroidBackButtonAction(): void {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.goBack();
    });
  }

  goBack = () => this.navCtrl.pop();

  getDataFromRoute(): void {
    this.route = this.routeParams.snapshot.queryParams.route;
    const startPosition = this.route[0];
    this.destination = this.route[this.route.length - 1];
    this.distance = this.localizacao.getPathDistance(this.route);
    this.title = this.destination.label;
    this.sensorsCurrentNode = startPosition;
    this.lastValidPosition = startPosition;
    this.lastMarkerPosition = startPosition;
    this.floor = startPosition.floor;
    this.currentFloorNodes = this.route.filter((node) => node.floor == this.floor);
  }

  handlePageInit(): void {
    this.showMap(); 
    this.setUserMarker();
    this.handleRoute();
    this.watchPosition();
    this.watchOrientation();
    this.watchAcceleration();
  }

  showMap(): void {
    const latLng = new google.maps.LatLng(this.lastMarkerPosition.coordinates.lat, this.lastMarkerPosition.coordinates.long);
    const options = {
      center: latLng,
      zoom: 100,
      heading: 0,
      zoomControl: true,
      disableDefaultUI: true,
      vectorRendering: 'auto',
      mapId: MAP_ID,
      tilt: 100,
    };
    this.map = new google.maps.Map(
      this.mapRef.nativeElement, 
      options
    );
  }

  setUserMarker() : void {
    const latLng = new google.maps.LatLng(this.lastMarkerPosition.coordinates.lat, this.lastMarkerPosition.coordinates.long);        
    const icon = {
      url: NAVIGATION_MARKER_IMAGE_PATH,
      scaledSize: new google.maps.Size(35, 35),
    }
    this.currentPositionMarker = new google.maps.Marker({
      position: latLng,
      map: this.map,
      title: 'Você',
      icon: icon
    });
  }

  handleRoute(): void {
    if(this.currentRouteMarkers && this.currentRouteLine)
      this.removeRoute();
    this.addRouteMarkers();
    this.addRouteLine();
  }

  removeRoute(): void {
    this.currentRouteMarkers.forEach(node => {
      node.setMap(null);
    });
    this.currentRouteMarkers = [];
    this.currentRouteLine.setMap(null);
    this.currentRouteLine = undefined;
  }

  addRouteMarkers(): void {
    this.currentFloorNodes.forEach((node, index) => {
      if(!this.isFloorMessageVisible && node.isAccessNode && index != 0)
        this.showInstructionTitle(
          'Vá para o ponto de acesso ao próximo andar (em azul)!!', 
          ACCESS_NODE_INSTRUCTION_IMAGE_PATH,
          'Mantenha o mapa na direção do próximo ponto.'
        );

      const position = new google.maps.LatLng(node.coordinates.lat, node.coordinates.long);
      const icon = this.getIcon(node, index);
      const mapMarker = new google.maps.Marker({
        position: position,
        map: this.map,
        title: node.label,
        latitude: node.coordinates.lat,
        longitude: node.coordinates.long,
        icon: icon
      });
      this.currentRouteMarkers.push(mapMarker);
      mapMarker.setMap(this.map);
    });
    //Se não tem nenhum ponto de acesso
    if(!this.isMessageVisible)
      this.showInstructionTitle(
        "Siga adiante deixando o mapa na direção dos pontos da rota!", 
        DEFAULT_INSTRUCTION_IMAGE_PATH, 
        'Se o celular for equipado com bússola, o app irá rotacionar o mapa automaticamente. Caso contrário você deve movê-lo manualmente para a direção correta.'
      );
  }

  getIcon(node: Node, index: number){
    const isRouteDestination = this.localizacao.isPointsTheSame(node.coordinates, this.destination.coordinates);
    if(isRouteDestination)
      return {
        url: NAVIGATION_DESTINATION_IMAGE_PATH,
        scaledSize: new google.maps.Size(65, 65)
      };
    if(node.isAccessNode) return ACCESS_NODE_ICON;
    return DEFAULT_NODE_ICON;
  }

  addRouteLine(): void {
    const points = this.currentFloorNodes.map(node => {
      return new google.maps.LatLng(node.coordinates.lat, node.coordinates.long);
    });
    this.currentRouteLine = new google.maps.Polyline({
      ...DEFAULT_LINE_STYLE,
      path: points,
    });
    this.currentRouteLine.setMap(this.map);
  }  

  async watchPosition(): Promise<void> {
    const isStreamRunning = Boolean(this.geolocationStream);
    if (isStreamRunning) return;

    const options = {
      maximumAge: 0,
      enableHighAccuracy: true,
      timeout: 2000
    }
    this.geolocationStream = await Geolocation.watchPosition(
      options,
      async (pos: Position, posError?: any) => {
        if(this.isStreamPaused) return;
        const hasError = posError || !pos.coords;
        if(hasError){
          this.toast.showMessage('Você está experimentando problemas na localização', 'danger');
          return;
        }
        
        const isGpsPositionValid = this.checkGpsPositionIsValid(pos);
        const currentGpsPosition = isGpsPositionValid ? this.localizacao.convertGeolocationToNode(pos) : null;
        const currentSensorsPosition = this.handleNewSensorsNode();
        const isSensorsPositionValid = this.checkSensorsPosition(currentSensorsPosition);
        const isBothValid = isSensorsPositionValid && isGpsPositionValid;

        if(isBothValid){
          const currentSensorFusionPosition = this.handleSensorFusionNode(currentGpsPosition, currentSensorsPosition);
          this.handleNewPosition(currentSensorFusionPosition);
          return;
        }

        if(isGpsPositionValid){
          this.handleNewPosition(currentGpsPosition);
          return;
        }
        
        if(isSensorsPositionValid){
          this.handleNewPosition(currentSensorsPosition);
          return;
        }

        const COUNT_LIMIT = 20;
        this.incorrectPositionCount++;

        if(this.incorrectPositionCount > COUNT_LIMIT){
          this.handleCancelNavigation();
        }
      }
    );

    //Obriga uma nova consulta a cada 2 segundos
    setTimeout(async () => {
      //Condição de parada
      if(!this.isStreamEnabled) return;

      const isStreamRunning = Boolean(this.geolocationStream);
      if (isStreamRunning)
        await this.clearGeolocationStream();
      
      this.watchPosition();
    }, 2000);
  }

  handleNewSensorsNode(): Node {
    const totalDistanceInMeters: number = this.steps * STEP_SIZE_IN_METERS;
    this.steps = 0;
    const sensorsNodeCoordinates = this.localizacao.calcDestination(
      this.lastValidPosition.coordinates, 
      totalDistanceInMeters, 
      this.currentDirectionInDegrees
    );
    const sensorsNode = {
      ...this.lastValidPosition,
      coordinates: sensorsNodeCoordinates
    };
    return sensorsNode;
  }
  
  checkGpsPositionIsValid(pos: Position): boolean {
    //Checa se a acurácia permite estimar um provável ponto do usuário
    if(pos.coords.accuracy > GPS_ACCURACY_LIMIT_IN_METERS) return false;
    
    //Checa se poderemos utilizar a atual posição do gps
    const distanceFromLastMarkerPosition = this.localizacao.getDistanceBetweenPoints(
      {
        lat: pos.coords.latitude,
        long: pos.coords.longitude
      },
      this.lastMarkerPosition.coordinates
    );
    const LIMIT_IN_METERS = 8;
    return distanceFromLastMarkerPosition <= LIMIT_IN_METERS; 
  }

  checkSensorsPosition(node: Node): boolean {
    //Checa se poderemos utilizar a atual posição dos sensores
    const distanceFromLastValidPosition = this.localizacao.getDistanceBetweenPoints(
      this.lastValidPosition.coordinates,
      node.coordinates
    );
    const nearestNode = this.localizacao.getNearestNode(node, this.route);
    const distanceFromAnyNode = this.localizacao.getDistanceBetweenPoints(node.coordinates, nearestNode.coordinates);
    const LIMIT_LAST_VALID_POSITION = 6;
    const LIMIT_ANY_NODE = 8;
    return distanceFromLastValidPosition <= LIMIT_LAST_VALID_POSITION && distanceFromAnyNode <=  LIMIT_ANY_NODE; 
  }

  async handleNewPosition(node: Node): Promise<void> {
    const nearestNode = this.localizacao.getNearestNode(node, this.currentFloorNodes);

    if(nearestNode.isAccessNode)
      this.handleAccessNode(nearestNode);

    const markerNotMoved = this.localizacao.isPointsTheSame(nearestNode.coordinates, this.lastMarkerPosition.coordinates); 
    if(markerNotMoved){
      this.lastValidPosition = node;
      return;
    }
    
    this.lastValidPosition = nearestNode;
    this.lastMarkerPosition = nearestNode;

    const latLng = new google.maps.LatLng(nearestNode.coordinates.lat, nearestNode.coordinates.long);
    this.currentPositionMarker.setPosition(latLng);
    this.map.setCenter(latLng);
    this.distance = this.localizacao.getPathDistance(this.getRemainingPoints(nearestNode));

    const userArrived = this.localizacao.isPointsTheSame(nearestNode.coordinates, this.destination.coordinates);
    if(userArrived){
      this.handleFinishNavigation();
      this.isMessageVisible = false;
    }
  }

  handleAccessNode(nearestNode: Node): void {
    this.nextFloor = this.getNextFloor(nearestNode);
    if(this.nextFloor != this.floor && !this.isFloorMessageVisible){
      this.instructionTitle = `Pegue o acesso ao andar ${this.nextFloor}`;
      this.instructionDescription = `Estamos aguardando você chegar ao ${this.nextFloor} andar. Clique em "Continuar" para prosseguir com a rota.`
      this.currentInstructionImage = FLOOR_TRANSITION_INSTRUCTION_IMAGE_PATH;
      this.isStreamPaused = true;
      this.setFloorMessageVisible();
    }
  }

  getRemainingPoints(nearestNode: Node): Node[] {
    const index = this.route.findIndex(node => node.label == nearestNode.label);
    let remainingPoints: Node[] = [];
    for(let i = index; i < this.route.length; i++) 
      remainingPoints.push(this.route[i]);
    return remainingPoints;
  }

  getNextFloor(nearestNode: Node): number {
    let floor: number = nearestNode.floor;
    this.route.find((node, index) => {
      if(this.localizacao.isPointsTheSame(node.coordinates, nearestNode.coordinates)){
        const nextNodeIndex = index + 1;
        const positionExists = Boolean(this.route[nextNodeIndex]);
        if(positionExists)
          floor = this.route[nextNodeIndex].floor;
        return true;
      }
      return false
    });

    return floor;
  }

  handleSensorFusionNode(gpsNode: Node, sensorsNode: Node): Node {
    //Centro entre os pontos do gps e do nó magnetômetro/acelerômetro
    const sensorFusionCoordinates = this.localizacao.getCenterFromPoints(sensorsNode.coordinates, gpsNode.coordinates);
    const sensorFusionNode = {
      label: 'SensorFusionNode',
      coordinates: sensorFusionCoordinates,
      isDestination: false,
      isAccessNode: false
    } as Node;
    return sensorFusionNode;
  }  

  handleCancelNavigation(): void {
    this.toast.showMessage("Seu trajeto foi finalizado. Retornando para a tela de escolha...", 'danger');
    this.isStreamEnabled = false;
    setTimeout(()=> this.goBack(), 4000);
  }

  handleFinishNavigation(): void {
    this.isStreamEnabled = false;
    this.currentInstructionImage = SUCCESS_INSTRUCTION_IMAGE_PATH;
    this.setSuccessMessageVisible();
  }

  watchOrientation(): void {
    Motion.addListener('orientation', (event: DeviceOrientationEvent) => {
      if(!this.isStreamEnabled || this.isStreamPaused) return;

      const rotation = event.alpha ? 360 - event.alpha : 0;
      this.currentDirectionInDegrees = rotation;
      this.map.setHeading(rotation);
    });
  }

  watchAcceleration(): void {
    Motion.addListener('accel', (event: AccelListenerEvent) => {
      if(!this.isStreamEnabled || this.isStreamPaused) return;

      const countedStepOnXAxis = event.acceleration.x < -STEP_THRESHOLD || event.acceleration.x > STEP_THRESHOLD;
      const countedStepOnYAxis = event.acceleration.y < -STEP_THRESHOLD || event.acceleration.y > STEP_THRESHOLD;
      const countedStepOnZAxis = event.acceleration.z < -STEP_THRESHOLD || event.acceleration.z > STEP_THRESHOLD;

      if(countedStepOnXAxis || countedStepOnYAxis || countedStepOnZAxis)
        this.steps++;
    });
  }

  setMessageVisible = () => this.isMessageVisible = !this.isMessageVisible;

  setFloorMessageVisible = () => this.isFloorMessageVisible = !Boolean(this.isFloorMessageVisible);

  setSuccessMessageVisible = () => this.isSuccessMessageVisible = !this.isSuccessMessageVisible;

  showInstructionTitle(message: string, image: string = DEFAULT_INSTRUCTION_IMAGE_PATH, description: string = ''): void {
    this.instructionTitle = message;
    this.currentInstructionImage = image;
    this.instructionDescription = description;
    this.setMessageVisible();
  }

  handleFloorChanges(): void {
    this.setFloorMessageVisible();
    this.floor = Number(this.nextFloor);
    this.currentFloorNodes = this.route.filter((node) => node.floor == this.floor);
    this.handleRoute();
    this.isStreamPaused = false;
  }

  reCenter(): void {
    const latLng = new google.maps.LatLng(this.lastMarkerPosition.coordinates.lat, this.lastMarkerPosition.coordinates.long);
    this.map.setCenter(latLng);
    this.map.setZoom(100);
  }

  async ionViewWillLeave(): Promise<void> {
    this.isStreamEnabled = false;
    await this.clearGeolocationStream();
    // await this.clearMotionStream();
  }

  async clearGeolocationStream(): Promise<void> {
    const options = {
      id: this.geolocationStream
    };
    await Geolocation.clearWatch(options);
    this.geolocationStream = null;
  }

  // async clearMotionStream(): Promise<void> {
    // await Motion.removeAllListeners();
    // this.orientationStream = null;
    // this.accelerationStream = null;
  // }
}