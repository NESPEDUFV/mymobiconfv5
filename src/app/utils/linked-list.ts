/** @ignore */
class Node<T> {
  next: Node<T> = null;
  constructor(public item?: T) { }
}

/**
* Implementação personalizada de uma lista encadeada, para atender a fins específicos do app, como no caso dos reenvios
*/
export class LinkedList<T> {
  /** Célula cabeça */
  private head: Node<T>;
  /** Último nó da lista */
  private tail: Node<T>;
  /** Tamanho da lista */
  private length: number = 0;

  /**
   * Permite a inicialização da lista já com elementos
   * @param init Elementos iniciais para criação da lista
   */
  constructor(init?: T[]) {
      this.head = new Node<T>();
      this.tail = this.head;
      if (init) this.add(...init);
  }

  /**
   * Retorna o tamanho da lista encadeada
   * @returns Tamanho da lista encadeada
   */
  getLength(): number { return this.length; }

  /**
   * Retorna o `i`-ésimo item da lista
   * @param i Índice do elemento (começando em 0)
   * @returns O `i`-ésimo item
   */
  get(i: number): T {
      if (i < 0 || i >= this.length) return null;
      for (let current = this.head.next, index = 0; current; current = current.next, index++)
          if (index == i) return current.item;
  }

  /**
   * Transforma a lista encadeada em uma array
   * @returns Representação em array da lista
   */
  toArray(): T[] {
      let a: T[] = [];
      this.forEach(item => { a.push(item) });
      return a;
  }

  /**
   * Realiza a ação especificada para cada elemento na lista
   * @param callbackfn `forEach` chama a função `callbackfn` uma vez para cada elemento na lista
   */
  forEach(callbackfn: (item: T, index: number) => void) {
      for (let current = this.head.next, i = 0; current; current = current.next, i++)
          callbackfn(current.item, i);
  }

  /**
   * Filtra a lista, retornando numa array apenas os elementos cujo retorno na função `callbackfn` foi verdadeiro
   * @param callbackfn `filter` chama a função `callbackfn` uma vez para cada elemento na lista
   * @returns Os elementos de uma lista que atendem à condição especificada na função `callbackfn`
   */
  filter(callbackfn: (item: T, index: number) => boolean): T[] {
      let res: T[] = [];
      this.forEach((item, i) => { if (callbackfn(item, i)) res.push(item) });
      return res;
  }

  /**
   * Adiciona elementos ao fim da lista
   * @param items Itens a ser adicionados
   * @returns Novo tamanho da lista
   */
  add(...items: T[]): number {
      items.forEach(item => {
          this.tail.next = new Node<T>(item);
          this.tail = this.tail.next;
          this.length++;
      });
      return this.length;
  }

  /**
   * Remove os elementos especificados da lista
   * @param indexes Índices dos elementos que devem ser removidos. Esta array deve estar ordenada.
   * @returns Quantidade de elementos removidos
   */
  remove(...indexes: number[]): number {
      let c: number = 0;
      for (let current = this.head, i = 0; c < indexes.length && current.next; current = current.next, i++)
          while (i == indexes[c]) {
              current.next = current.next.next;
              i++;
              c++;
              if (current.next == null) {
                  this.tail = current;
                  return c;
              }
          }
      return c;
  }
}
