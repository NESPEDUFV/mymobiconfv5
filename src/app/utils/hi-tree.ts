/**
 * Definição do nó da árvore HI
 */
 interface HITreeNode<T> {
  /** Item a ser armazenado no nó */
  item: T
  /** Máximo do intervalo na subárvore */
  max: number
  /** ID do nó à esquerda */
  left: string
  /** ID do nó à direita */
  right: string
  /** Altura da subárvore */
  height: number
}

/**
* Implementação própria de uma mistura de tabela hash (H - Hash) mesclada
* com uma árvore de intervalo (I - Interval). Desta forma, permite uma busca por ID
* como também por intervalo. Esta implementação usa balanceamento AVL.
*/
export class HITree<T> {
  /** Nós da árvore */
  private nodes: { [ID: string]: HITreeNode<T> };
  /** ID do nó raiz */
  private root: string;

  /**
   * Cria uma nova árvore HI
   * @param id Função para extrair o ID do item
   * @param low Função para extrair o número menor do intervalo a partir do item
   * @param high Função para extrair o número maior do intervalo a partir do item
   * @param fromJSON Representação de string JSON a partir da qual a árvore deve ser montada
   */
  constructor(private id: (item: T) => string, private low: (item: T) => number,
      private high: (item: T) => number, fromJSON?: string) {
      let jsonTree = JSON.parse(fromJSON || null);
      if (jsonTree) {
          this.nodes = jsonTree.nodes;
          this.root = jsonTree.root;
      } else {
          this.nodes = {};
          this.root = null;
      }
  }

  /**
   * Retorna o item cujo ID coincide com `id`
   * @param id ID do item a ser retornado
   * @returns Item cujo ID coincide com `id`
   */
  getByID(id: string): T {
      return this.nodes[id].item;
  }

  /**
   * Filtra os itens da árvore procurando os intervalos que se sobrepõe com o intervalo passado
   * @param low Ponto inferior do intervalo
   * @param high Ponro superior do intervalo
   * @param exc Faz a análise dos intervalos ser exclusiva ao invés do padrão, inclusivo
   * @returns Lista com os itens da árvore cujo intervalo inclui o ponto `p`
   */
  getByInterval(low: number, high: number, exc?: boolean): T[] {
      let match: T[] = [];
      let traverse = (current: HITreeNode<T>) => {
          if (!current)
              return;
          let item = current.item;
          let afterLow = exc ? this.low(item) < high : this.low(item) <= high;
          let beforeHigh = exc ? low < this.high(item) : low <= this.high(item);
          let beforeMax = exc ? low < current.max : low <= current.max;
          if (beforeMax)
              traverse(this.nodes[current.left]);
          if (afterLow && beforeHigh)
              match.push(item);
          if (afterLow && beforeMax)
              traverse(this.nodes[current.right]);
      }
      traverse(this.nodes[this.root]);
      return match;
  }

  /**
   * Filtra os itens da árvore procurando os intervalos (inclusivos) que contém o ponto `p`
   * @param p Ponto de pesquisa nos intervalos
   * @param tolerance Adiciona uma margem de tolerância em volta do ponto
   * @param exc Faz a análise dos intervalos ser exclusiva ao invés do padrão, inclusivo
   * @returns Lista com os itens da árvore cujo intervalo inclui o ponto `p`
   */
  getByPoint(p: number, tolerance?: number, exc?: boolean): T[] {
      return this.getByInterval(p - (tolerance || 0), p + (tolerance || 0), exc);
  }

  /**
   * Adiciona um novo item na árvore
   * @param item Item a ser adicionado
   */
  add(item: T) {
      let id = this.id(item);
      if (this.nodes[id]) return;
      let add = (cID: string): string => {
          let current = this.nodes[cID];
          if (!current) {
              this.nodes[id] = this.newNode(item);
              return id;
          }
          if (this.order(item, current.item) < 0)
              current.left = add(current.left);
          else
              current.right = add(current.right);
          let bf = this.bf(current);
          if (bf < -1) {
              if (this.order(item, this.nodes[current.left].item) < 0)
                  return this.rotR(cID);
              else
                  return this.rotLR(cID);
          } else if (bf > 1) {
              if (this.order(item, this.nodes[current.right].item) >= 0)
                  return this.rotL(cID);
              else
                  return this.rotRL(cID);
          }
          this.update(current);
          return cID;
      }
      this.root = add(this.root);
  }

  /**
   * Cria um novo nó contendo o item passado e o retorna
   * @param item Item a ser colocado no nó
   * @returns Novo nó contendo `item`
   */
  private newNode(item: T): HITreeNode<T> {
      return {
          item: item,
          max: this.high(item),
          left: null,
          right: null,
          height: 0
      }
  }

  /**
   * Retorna a altura da subárvore começada por um dado nó
   * @param id ID do nó cuja altura de sua subárvore é calculada
   * @returns O valor da altura da subárvore ou -1 caso o nó não exista
   */
  private ht(id: string): number {
      let node = this.nodes[id];
      return node ? node.height : -1;
  }

  /**
   * Calcula o fator de balanceamento de um nó (`altura do filho à direita - altura do filho à esquerda`) e o retorna
   * @param node Nó cujo fator de balanceamento será calculado
   * @returns Fator de balanceamento
   */
  private bf(node: HITreeNode<T>): number {
      return this.ht(node.right) - this.ht(node.left);
  }

  /**
   * Atualiza os valores `height` e `max` do nó
   * @param node Nó cujos valores serão atualizados
   */
  private update(node: HITreeNode<T>) {
      node.max = Math.max(
          this.high(node.item),
          node.left && this.nodes[node.left].max,
          node.right && this.nodes[node.right].max
      );
      node.height = 1 + Math.max(this.ht(node.left), this.ht(node.right));
  }

  /**
   * Determina a ordem entre os itens
   * @param a Item a ser avaliado
   * @param b Item a ser avaliado
   * @returns Um número menor que 0, caso `a` venha antes de `b`; igual a 0 caso `a` e `b` tenham a mesma colocação; ou maior que 0 caso `a` venha depois de `b`
   */
  private order(a: T, b: T) {
      let dif = this.low(a) - this.low(b);
      return dif ? dif : this.high(a) - this.high(b);
  }

  /**
   * Executa uma rotação à esquerda
   * @param root ID do nó raiz da subárvore, que servirá de ponto de partida para a rotação
   * @returns ID do nó que servirá de nova raiz da subárvore
   */
  private rotL(root: string): string {
      let rootNode = this.nodes[root];
      let rt = rootNode.right, rtNode = this.nodes[rt];
      rootNode.right = rtNode.left;
      rtNode.left = root;
      this.update(rootNode);
      this.update(rtNode);
      return rt;
  }

  /**
   * Executa uma rotação à direita
   * @param root ID do nó raiz da subárvore, que servirá de ponto de partida para a rotação
   * @returns ID do nó que servirá de nova raiz da subárvore
   */
  private rotR(root: string): string {
      let rootNode = this.nodes[root];
      let lt = rootNode.left, ltNode = this.nodes[lt];
      rootNode.left = ltNode.right;
      ltNode.right = root;
      this.update(rootNode);
      this.update(ltNode);
      return lt;
  }

  /**
   * Executa uma rotação esquerda-direita
   * @param root ID do nó raiz da subárvore, que servirá de ponto de partida para a rotação
   * @returns ID do nó que servirá de nova raiz da subárvore
   */
  private rotLR(root: string): string {
      let rootNode = this.nodes[root];
      let lt = rootNode.left, ltNode = this.nodes[lt];
      let ltRt = ltNode.right, ltRtNode = this.nodes[ltRt];
      let endA = ltRtNode.left, endB = ltRtNode.right;
      ltRtNode.left = lt; ltRtNode.right = root;
      ltNode.right = endA; rootNode.left = endB;
      this.update(rootNode);
      this.update(ltNode);
      this.update(ltRtNode);
      return ltRt;
  }

  /**
   * Executa uma rotação direita-esquerda
   * @param root ID do nó raiz da subárvore, que servirá de ponto de partida para a rotação
   * @returns ID do nó que servirá de nova raiz da subárvore
   */
  private rotRL(root: string): string {
      let rootNode = this.nodes[root];
      let rt = rootNode.right, rtNode = this.nodes[rt];
      let rtLt = rtNode.left, rtLtNode = this.nodes[rtLt];
      let endA = rtLtNode.left, endB = rtLtNode.right;
      rtLtNode.right = rt; rtLtNode.left = root;
      rootNode.right = endA; rtNode.left = endB;
      this.update(rootNode);
      this.update(rtNode);
      this.update(rtLtNode);
      return rtLt;
  }

  /**
   * Apaga toda a árvore
   */
  clear() {
      this.root = null;
      for (let id in this.nodes)
          delete this.nodes[id];
  }

  /**
   * Realiza a ação especificada para cada elemento na árvore, percorrendo-a em ordem
   * @param callbackfn `forEach` chama a função `callbackfn` uma vez para cada elemento na árvore
   */
  forEach(callbackfn: (item: T, index: number) => void) {
      let i = 0;
      let traverse = (current: HITreeNode<T>) => {
          if (!current) return;
          traverse(this.nodes[current.left]);
          callbackfn(current.item, i++);
          traverse(this.nodes[current.right]);
      }
      traverse(this.nodes[this.root]);
  }

  /**
    * Determina se a callback especificada retorna `true` para algum elemento da árvore
    * @param callbackfn `some` chama a função `callbackfn` em cada elemento da árvore até encontrar algum que retorne `true` ou até acabar os elementos
    */
  some(callbackfn: (item: T) => boolean): boolean {
      for (let id in this.nodes)
          if (callbackfn(this.nodes[id].item))
              return true;
      return false;
  }

  /**
   * Retorna uma array com os elementos da árvore que atendem à condição especificada na função `callbackfn`
   * @param callbackfn `filter` chama a função `callbackfn` uma vez para cada elemento na lista
   * @returns Os elementos da árvore que atendem à condição especificada na função `callbackfn`
   */
  filter(callbackfn: (item: T, index: number) => boolean): T[] {
      let res: T[] = [];
      this.forEach((item, i) => { if (callbackfn(item, i)) res.push(item) });
      return res;
  }
}
