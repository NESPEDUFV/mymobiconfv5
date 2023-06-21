import { Geolocation, Position } from '@capacitor/geolocation';
import * as geolib from 'geolib';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocalizacaoService {
    //Lida com as permissões de geolocalização
    public async handleGeolocationPermission(): Promise<boolean>{
        const isPermissionNotGranted = (await Geolocation.checkPermissions()).location != 'granted';
        if(isPermissionNotGranted){
          const permissions = await Geolocation.requestPermissions({permissions: ['location']});
          return permissions.location == 'granted';
        }
        return true;
    }

    //Retorna a distância total da rota
    public getPathDistance(route: Node[]): number {
        const formattedPathNodes = route.map(node => { return {latitude: node.coordinates.lat, longitude: node.coordinates.long}});
        const totalDistanceInMeters = geolib.getPathLength(formattedPathNodes);
        return totalDistanceInMeters;
    }

    //Converte objeto no formato Position do plugin de Geolocalização para Node
    public convertGeolocationToNode(position: Position): Node {
        return {
            label: 'Você',
            coordinates: {
                lat: position.coords.latitude,
                long: position.coords.longitude,
            },
            isDestination: false,
            isAccessNode: false
        } as Node;
    }

    //Pega posição atual do dispositivo e retorna o respectivo nó formatado
    public async getPositionFromDevice(): Promise<Node> {
        const currentPosition: Position = await Geolocation.getCurrentPosition({enableHighAccuracy: true});
         
        const isLatAndLongFilled = (currentPosition.coords.latitude != undefined) && (currentPosition.coords.longitude != undefined);
        
        if(!isLatAndLongFilled){
            this.getPositionFromDevice();
            return;
        }

        return this.convertGeolocationToNode(currentPosition);
    }

    //Recebe um ponto (lat, long), uma direção e a distância percorrida e retorna as novas coordenadas (lat, long) 
    public calcDestination(coordinates: Coordinates, distanceInMeters: number, bearingInDegrees: number): Coordinates{
        const newCoordinates = geolib.computeDestinationPoint(
            { latitude: coordinates.lat, longitude: coordinates.long },
            distanceInMeters,
            bearingInDegrees
        );

        return {
            lat: newCoordinates.latitude,
            long: newCoordinates.longitude
        };
    }

    //Identifica o ponto médio entre 2 pontos e me retorna as respectivas coordenadas
    public getCenterFromPoints(p1: Coordinates, p2: Coordinates): Coordinates {
        const newCoordinates = geolib.getCenter(
            [
                {
                    latitude: p1.lat,
                    longitude: p1.long
                },
                {
                    latitude: p2.lat,
                    longitude: p2.long
                }
            ]
        );

        if(!newCoordinates) return;

        return {
            lat: newCoordinates.latitude,
            long: newCoordinates.longitude
        };
    }

    //Compara se dois pontos são iguais e retorna um boolean
    public isPointsTheSame(p1: Coordinates, p2: Coordinates): boolean {
        return (p1.lat == p2.lat && p1.long == p2.long);
    }

    //Retorna a distância entre dois pontos
    public getDistanceBetweenPoints(p1: Coordinates, p2: Coordinates): number {
        return geolib.getDistance(
            {
                latitude: p1.lat,
                longitude: p1.long
            }, 
            {
                latitude: p2.lat,
                longitude: p2.long
            }
        );
    }

    //Retorna qual elemento do array de nós é o mais próximo ao nó fornecido
    public getNearestNode(node: Node, nodeArray: Node[]): Node {
        const formattedNodePositions = nodeArray.map(node => {return {latitude: node.coordinates.lat, longitude: node.coordinates.long}});
        const nearestNodeCoordinates: any = geolib.findNearest(
            { 
                latitude: node.coordinates.lat, 
                longitude: node.coordinates.long 
            }, 
            formattedNodePositions
        );
        const nearestNode = nodeArray.find(node => 
            this.isPointsTheSame(
                node.coordinates, 
                {
                    lat: nearestNodeCoordinates.latitude, 
                    long: nearestNodeCoordinates.longitude
                }
            )
        );
        return nearestNode;
    }
}

//Coordenadas que definem um ponto no mapa
export interface Coordinates {
    lat: number,
    long: number
}
  
//Nó do grafo
export interface Node {
    label: string,
    coordinates: Coordinates,
    isDestination: boolean,
    isAccessNode: boolean,
    floor: number,
    description?: string,
    image?: string,
}

//Caminho entre 2 pontos do Grafo
export interface Edge {
    distance: number
}

//Constantes
export const STEP_THRESHOLD: number = 1.3;
export const STEP_SIZE_IN_METERS: number = 0.2;
export const GPS_ACCURACY_LIMIT_IN_METERS: number = 7;
export const FLOOR_TRANSITION_INSTRUCTION_IMAGE_PATH: string = '../../../assets/img/localizacao/change_floor.jpg';
export const DEFAULT_INSTRUCTION_IMAGE_PATH: string = '../../../assets/img/localizacao/arrow_direction.jpg';
export const ACCESS_NODE_INSTRUCTION_IMAGE_PATH: string = '../../../assets/img/localizacao/blue_point.png';
export const SUCCESS_INSTRUCTION_IMAGE_PATH: string = '../../../assets/img/localizacao/success.jpg';