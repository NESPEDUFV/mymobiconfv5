'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">v4 documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-52c610556d40fd168942b6bdc2ef9c8b"' : 'data-target="#xs-components-links-module-AppModule-52c610556d40fd168942b6bdc2ef9c8b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-52c610556d40fd168942b6bdc2ef9c8b"' :
                                            'id="xs-components-links-module-AppModule-52c610556d40fd168942b6bdc2ef9c8b"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-52c610556d40fd168942b6bdc2ef9c8b"' : 'data-target="#xs-injectables-links-module-AppModule-52c610556d40fd168942b6bdc2ef9c8b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-52c610556d40fd168942b6bdc2ef9c8b"' :
                                        'id="xs-injectables-links-module-AppModule-52c610556d40fd168942b6bdc2ef9c8b"' }>
                                        <li class="link">
                                            <a href="injectables/ArmazenamentoService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ArmazenamentoService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/OverlayService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>OverlayService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ServidorService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ServidorService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UsuarioService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>UsuarioService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/EventoInfoPageModule.html" data-type="entity-link">EventoInfoPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-EventoInfoPageModule-dc351cf1ce1832d9bbf9f4a7ac202e3a"' : 'data-target="#xs-components-links-module-EventoInfoPageModule-dc351cf1ce1832d9bbf9f4a7ac202e3a"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-EventoInfoPageModule-dc351cf1ce1832d9bbf9f4a7ac202e3a"' :
                                            'id="xs-components-links-module-EventoInfoPageModule-dc351cf1ce1832d9bbf9f4a7ac202e3a"' }>
                                            <li class="link">
                                                <a href="components/EventoInfoPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EventoInfoPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/EventoInfoPageRoutingModule.html" data-type="entity-link">EventoInfoPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/EventoInscricaoPageModule.html" data-type="entity-link">EventoInscricaoPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-EventoInscricaoPageModule-405d9575f81074826534d10fe5c73572"' : 'data-target="#xs-components-links-module-EventoInscricaoPageModule-405d9575f81074826534d10fe5c73572"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-EventoInscricaoPageModule-405d9575f81074826534d10fe5c73572"' :
                                            'id="xs-components-links-module-EventoInscricaoPageModule-405d9575f81074826534d10fe5c73572"' }>
                                            <li class="link">
                                                <a href="components/EventoInscricaoPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EventoInscricaoPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/EventoInscricaoPageRoutingModule.html" data-type="entity-link">EventoInscricaoPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/EventosPageModule.html" data-type="entity-link">EventosPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-EventosPageModule-01a5f0c5617d64d4fda10d2e443ae1fc"' : 'data-target="#xs-components-links-module-EventosPageModule-01a5f0c5617d64d4fda10d2e443ae1fc"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-EventosPageModule-01a5f0c5617d64d4fda10d2e443ae1fc"' :
                                            'id="xs-components-links-module-EventosPageModule-01a5f0c5617d64d4fda10d2e443ae1fc"' }>
                                            <li class="link">
                                                <a href="components/EventosPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EventosPage</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-EventosPageModule-01a5f0c5617d64d4fda10d2e443ae1fc"' : 'data-target="#xs-pipes-links-module-EventosPageModule-01a5f0c5617d64d4fda10d2e443ae1fc"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-EventosPageModule-01a5f0c5617d64d4fda10d2e443ae1fc"' :
                                            'id="xs-pipes-links-module-EventosPageModule-01a5f0c5617d64d4fda10d2e443ae1fc"' }>
                                            <li class="link">
                                                <a href="pipes/DatasPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DatasPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/EventosPageRoutingModule.html" data-type="entity-link">EventosPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/HomePageModule.html" data-type="entity-link">HomePageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-HomePageModule-d84865d8ebad41fb3c81764d7dcd91c9"' : 'data-target="#xs-components-links-module-HomePageModule-d84865d8ebad41fb3c81764d7dcd91c9"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HomePageModule-d84865d8ebad41fb3c81764d7dcd91c9"' :
                                            'id="xs-components-links-module-HomePageModule-d84865d8ebad41fb3c81764d7dcd91c9"' }>
                                            <li class="link">
                                                <a href="components/HomePage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HomePage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/HomePageRoutingModule.html" data-type="entity-link">HomePageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/LoginPageModule.html" data-type="entity-link">LoginPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-LoginPageModule-180590244cbacebf8625dd33575b854d"' : 'data-target="#xs-components-links-module-LoginPageModule-180590244cbacebf8625dd33575b854d"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-LoginPageModule-180590244cbacebf8625dd33575b854d"' :
                                            'id="xs-components-links-module-LoginPageModule-180590244cbacebf8625dd33575b854d"' }>
                                            <li class="link">
                                                <a href="components/LoginPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoginPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/LoginPageRoutingModule.html" data-type="entity-link">LoginPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MyMobiConfPageModule.html" data-type="entity-link">MyMobiConfPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-MyMobiConfPageModule-b4274c4e41e6ed352b5b503e32a175ba"' : 'data-target="#xs-components-links-module-MyMobiConfPageModule-b4274c4e41e6ed352b5b503e32a175ba"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-MyMobiConfPageModule-b4274c4e41e6ed352b5b503e32a175ba"' :
                                            'id="xs-components-links-module-MyMobiConfPageModule-b4274c4e41e6ed352b5b503e32a175ba"' }>
                                            <li class="link">
                                                <a href="components/MyMobiConfPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MyMobiConfPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/MyMobiConfPageRoutingModule.html" data-type="entity-link">MyMobiConfPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ParceirosPageModule.html" data-type="entity-link">ParceirosPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ParceirosPageModule-f8a67479a45d400566a3df313ca454e2"' : 'data-target="#xs-components-links-module-ParceirosPageModule-f8a67479a45d400566a3df313ca454e2"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ParceirosPageModule-f8a67479a45d400566a3df313ca454e2"' :
                                            'id="xs-components-links-module-ParceirosPageModule-f8a67479a45d400566a3df313ca454e2"' }>
                                            <li class="link">
                                                <a href="components/ParceirosPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ParceirosPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ParceirosPageRoutingModule.html" data-type="entity-link">ParceirosPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SignupPageModule.html" data-type="entity-link">SignupPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SignupPageModule-02d2aa7a8277bb1ed1efac83bc654214"' : 'data-target="#xs-components-links-module-SignupPageModule-02d2aa7a8277bb1ed1efac83bc654214"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SignupPageModule-02d2aa7a8277bb1ed1efac83bc654214"' :
                                            'id="xs-components-links-module-SignupPageModule-02d2aa7a8277bb1ed1efac83bc654214"' }>
                                            <li class="link">
                                                <a href="components/SignupPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SignupPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SignupPageRoutingModule.html" data-type="entity-link">SignupPageRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#components-links"' :
                            'data-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/TutorialComponent.html" data-type="entity-link">TutorialComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#directives-links"' :
                                'data-target="#xs-directives-links"' }>
                                <span class="icon ion-md-code-working"></span>
                                <span>Directives</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="directives-links"' : 'id="xs-directives-links"' }>
                                <li class="link">
                                    <a href="directives/BackgroundDirective.html" data-type="entity-link">BackgroundDirective</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AppPage.html" data-type="entity-link">AppPage</a>
                            </li>
                            <li class="link">
                                <a href="classes/DatasUtil.html" data-type="entity-link">DatasUtil</a>
                            </li>
                            <li class="link">
                                <a href="classes/HITree.html" data-type="entity-link">HITree</a>
                            </li>
                            <li class="link">
                                <a href="classes/ServLogin.html" data-type="entity-link">ServLogin</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AtividadesService.html" data-type="entity-link">AtividadesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConfigService.html" data-type="entity-link">ConfigService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EventoService.html" data-type="entity-link">EventoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FirebaseService.html" data-type="entity-link">FirebaseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NoticiaService.html" data-type="entity-link">NoticiaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NotificacoesService.html" data-type="entity-link">NotificacoesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ParceirosService.html" data-type="entity-link">ParceirosService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ServAtividades.html" data-type="entity-link">ServAtividades</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ServEventos.html" data-type="entity-link">ServEventos</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ServNoticias.html" data-type="entity-link">ServNoticias</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ServParceiros.html" data-type="entity-link">ServParceiros</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AtividadeInterface.html" data-type="entity-link">AtividadeInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AtivNoDiaInterface.html" data-type="entity-link">AtivNoDiaInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EventoInterface.html" data-type="entity-link">EventoInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HITreeNode.html" data-type="entity-link">HITreeNode</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NoticiaInterface.html" data-type="entity-link">NoticiaInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NotifInterface.html" data-type="entity-link">NotifInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ParceiroInterface.html" data-type="entity-link">ParceiroInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UsuarioInterface.html" data-type="entity-link">UsuarioInterface</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});