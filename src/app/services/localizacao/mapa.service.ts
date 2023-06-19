import { Edge, Node } from '../../services/localizacao/localizacao.service';
import Graph from 'graphology';
import { Injectable } from '@angular/core';
import { LocalizacaoService } from './localizacao.service';
import {} from 'google-maps';

@Injectable({
    providedIn: 'root'
})
export class MapaService {
    constructor(private localizacao: LocalizacaoService){}
    //Extrai os pontos do mapa
    private extractPoints(jsonMap: FeatureColletion): Node[] {
        const points: Node[] = [];

        jsonMap.features.forEach((item: Feature)=> {
            if(item.geometry.type == ItemType.Point){
                points.push({
                    label: item.properties.name,
                    coordinates: {
                        lat: item.geometry.coordinates[1],
                        long: item.geometry.coordinates[0]
                    },
                    isDestination: item.properties.isDestination == '1' ? true : false,
                    isAccessNode: item.properties.isAccessNode == '1' ? true : false,
                    floor: Number(item.properties.floor),
                    description: item.properties.description ?? null,
                    image: item.properties.image ?? null
                } as Node);
            }
        });
        return points;
    }

    //Extrai as linhas do mapa
    private extractLines(jsonMap: FeatureColletion): Line[] {
        const lines: Line[] = [];

        jsonMap.features.forEach((item)=> {
            if(item.geometry.type == ItemType.Line){
                lines.push({
                    p1: {
                        lat: item.geometry.coordinates[0][1],
                        long: item.geometry.coordinates[0][0]
                    },
                    p2: {
                        lat: item.geometry.coordinates[1][1],
                        long: item.geometry.coordinates[1][0]
                    }
                } as Line);
            }
        });

        return lines;
    }

    //Monta grafo do mapa para uso da interface
    mountGraph(jsonMap: FeatureColletion): Graph<Node, Edge> {
        const lines: Line[] = this.extractLines(jsonMap);
        const points: Node[] = this.extractPoints(jsonMap);
        const mapGraph = new Graph<Node, Edge>({
            multi: true
        });
        lines.map(line => {
            const p1: Node| undefined = points.find(point => this.localizacao.isPointsTheSame(line.p1, point.coordinates));
            const p2: Node | undefined = points.find(point => this.localizacao.isPointsTheSame(line.p2, point.coordinates));
            const distanceInMeters = this.localizacao.getDistanceBetweenPoints(p1!.coordinates, p2!.coordinates);
            this.addEdgeAndPointsToGraph(p1, p2, distanceInMeters, mapGraph);
        });
        return mapGraph;
    }
    
    
    //Adiciona Nós e Arestas ao grafo
    private addEdgeAndPointsToGraph(p1: Node | undefined, p2: Node | undefined, distance: number, mapGraph: Graph){
        this.addNodeToGraph(p1, mapGraph);
        this.addNodeToGraph(p2, mapGraph);
        mapGraph.addEdge(
            p1?.label, 
            p2?.label, 
            { distance}
        );
        mapGraph.addEdge(
            p2?.label, 
            p1?.label, 
            { distance }
        );
    }
    
    //Adiciona um nó no grafo
    private addNodeToGraph(point: Node | undefined, mapGraph: Graph){
        try{
            mapGraph.getNodeAttributes(point.label);
        } catch(e){
            mapGraph.addNode(
                point?.label,
                { 
                    label: point!.label, 
                    coordinates: point!.coordinates, 
                    isDestination: point!.isDestination,
                    isAccessNode: point!.isAccessNode,
                    description: point!.description,
                    image: point!.image,
                    floor: point!.floor
                }
            );
        }
    }
}

//Tipo de Feature do mapa, se é um ponto ou um aresta
export enum ItemType {
    Line = "LineString",
    Point = "Point"
}

//Descrição do google maps para os elementos que definem um ponto/uma aresta
export interface Geometry {
    type: ItemType,
    coordinates: number[] | number[][]
}

//Descrição do usuário para o elemento, onde podemos inserir dados no mapa
export interface Properties {
    name: string,
    description: string,
    isDestination: string,
    isAccessNode: string,
    floor: string,
    image?: string
}

//Um elemento do google maps
export interface Feature {
    geometry: Geometry,
    properties: Properties
}

//Lista de elementos do google maps
export interface FeatureColletion {
    features: Feature[]
}

interface Coordinates {
    lat: number,
    long: number
}

export interface Line {
    p1: Coordinates,
    p2: Coordinates,
}

export const DEFAULT_MAP_STYLE = [
    {
        featureType: "poi",
        elementType: "labels",
        stylers: [
            { visibility: "off" }
        ]
    }
]
export const NAVIGATION_MARKER_IMAGE_PATH = "assets/img/localizacao/up.png";
export const NAVIGATION_DESTINATION_IMAGE_PATH = "assets/img/localizacao/destination.png";
export const DESTINATION_MARKER_IMAGE_PATH = "assets/img/localizacao/destination_marker.png";
export const USER_MARKER_IMAGE_PATH = "assets/img/localizacao/you.png";
export const MAP_ID = "400fc6d511d6b37a";
export const DEFAULT_NODE_ICON = {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 5,
    fillColor: '#FFA600',
    fillOpacity: 1,
    strokeColor: '#555555',
    strokeWeight: 2,
};
export const ACCESS_NODE_ICON = {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 6.5,
    fillColor: '#A4BDFF',
    fillOpacity: 1,
    strokeColor: '#555555',
    strokeWeight: 2,
};
export const DEFAULT_LINE_STYLE = {
    strokeColor: '#555555',
    strokeOpacity: 1.0,
    strokeWeight: 3,
}