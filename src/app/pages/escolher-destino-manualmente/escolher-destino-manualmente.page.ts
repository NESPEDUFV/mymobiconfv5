import { ViewChild, ElementRef, Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import {  DEFAULT_NODE_ICON, DESTINATION_MARKER_IMAGE_PATH, MAP_ID } from 'src/app/services/localizacao/mapa.service';
import { NO_IMAGE_PATH, NO_IMAGE_POINT_PATH, Node } from 'src/app/services/localizacao/localizacao.service';
import {} from 'google-maps';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationSharedVariables } from 'src/app/services/localizacao/shared.service';

declare var google: any;

@Component({
  selector: 'app-localizacao',
  templateUrl: 'escolher-destino-manualmente.page.html',
  styleUrls: ['escolher-destino-manualmente.page.scss'],
})
export class EscolherDestinoManualmentePage {
  /*Mapa*/
  map: google.maps.Map;
  @ViewChild('map', {read: ElementRef, static: false})
  mapRef: ElementRef = {} as ElementRef;
  
  /*Variáveis*/
  devicePosition: Node; 
  currentPositionImage: string = '';
  currentPositionDescription: string = '';
  markers: google.maps.Marker[];
  navigationMarkers: google.maps.Marker[];
  isCardVisible: boolean = false;
  floorCount: number = 0;
  selectedFloor: number = 1;
  mapNodes: Node[];

  constructor(
    public navCtrl: NavController,
    public router: Router,
    private shared: LocationSharedVariables
  ) {}
  
  ionViewDidEnter(): void {
    this.handlePageInit();
  }

  async handlePageInit(): Promise<void> {
    this.getDataFromShared();
    this.floorCount = this.getFloorCount();
    this.showMap(); 
    this.handleMarkers();
  }

  getDataFromShared(): void {
    this.mapNodes = this.shared.nodes;
  }

  getFloorCount(): number {
    let floorCount = 1;
    this.mapNodes.forEach(node => {
      if(node.floor > floorCount){
        floorCount = node.floor;
      }
    });
    return floorCount;
  }

  showMap(): void {
    const latLng = new google.maps.LatLng(this.mapNodes[0].coordinates.lat, this.mapNodes[0].coordinates.long);
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

  handleMarkers(): void {
    this.removeMarkers();
    let markers: google.maps.Marker[] = [];
    this.mapNodes.forEach(node => {
      if(node.floor != this.selectedFloor) return;
      const icon = node.isDestination ? {
        url: DESTINATION_MARKER_IMAGE_PATH,
        scaledSize: new google.maps.Size(45, 45)
      }
      : DEFAULT_NODE_ICON;
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
    this.markers = markers;
  }

  removeMarkers(): void {
    if(!this.markers) return;
    this.markers.forEach(point => point.setMap(null));
    this.markers = [];
  }

  async handleFloorChanges(): Promise<void> {
    this.handleMarkers();
  }

  addMarkerBehaviour(marker: google.maps.Marker, node: Node): void {
    marker.addListener('click', ()=> {
      this.devicePosition = node;
      this.currentPositionImage = this.devicePosition.image ? this.devicePosition.image : this.devicePosition.isDestination ? NO_IMAGE_PATH : NO_IMAGE_POINT_PATH;
      this.currentPositionDescription = this.devicePosition.description ? this.devicePosition.description : this.devicePosition.isDestination ? "Sem descrição" : "Ponto de navegação";
      this.showCard();
    });
  }

  showCard = () => this.isCardVisible = true;

  getNodesByFloor = (floor: number) => this.mapNodes.filter(node => node.floor == floor);

  reCenter(): void {
    const latLng = new google.maps.LatLng(this.devicePosition.coordinates.lat, this.devicePosition.coordinates.long);
    this.map.setCenter(latLng);
    this.map.setZoom(100);
  }

  generateFloorOptions(): number[] {
    return Array.from({ length: this.floorCount }, (_, index) => index + 1);
  }

  hideCard = () => this.isCardVisible = false;

  goBack = () => this.navCtrl.back();

  pickPosition(){
    this.shared.pickedPosition = this.devicePosition;
    this.shared.userPickedPosition = true;
    this.goBack();
  }
}