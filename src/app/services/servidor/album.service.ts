import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Figurinha } from 'src/app/models/figurinha';

@Injectable({
  providedIn: 'root'
})
export class ServAlbum {

   /**
     * @param http Usado para fazer os requests HTTP
     * @param url URL do servidor, o '@Inject' é necessario apenas em tipos primitivos.
     */
   constructor(private http: HttpClient, @Inject(String) private url: string) { }

   getAlbumEventoId(idEvento){
    const params = new HttpParams().set('idEvento', idEvento);
    var res =  this.http.get(this.url + '/App/album/getAlbumByEventId.php', { params });
    console.log('res', res);
    return res;
   }

   getImagesByUserId(userId: string,idAlbum:string){
    const params = new HttpParams().set('userId', userId).set('idAlbum', idAlbum);
    var res =  this.http.get(this.url + '/App/album/getImagensByUser.php', { params });
    console.log('res', res);
    return res;
   }

   postImage(image: Figurinha){
    var res =  this.http.post(this.url + '/App/album/postImage.php',image);
    console.log('res', res);
    return res;
   }
}
