sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], 
    /**
     * provide app-view type models (as in the first "V" in MVVC)
     * 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.Device} Device
     * 
     * @returns {Function} createDeviceModel() for providing runtime info for the device the UI5 app is running on
     */
    function (JSONModel, Device) {
        "use strict";

        return {
            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
        },

        createIframeModel: function () {
            var oModel = new JSONModel({
                gestioneSac : "https://initsac-svil.eu10.hcs.cloud.sap/sap/fpa/ui/tenants/f23bc/app.html#/analyticapp&/aa/98A01C039904DAFCEACE9DF3C5F74492/?url_api=true&mode=present&view_id=appBuilding"                
                //gestioneSac : "http://www.youtube.com/embed/cS1l_HzZMOg"
            });
            
            return oModel;
        },

            createModelModel: function () {
                var oModel = new JSONModel({                      
                    "selectCpCs": [{
                        "VALORE": "CP",
                        "DESCRIZIONE": "CP",
                        "DESCRIZIONE_ESTESA": "Competenza"
                    },
                    {
                        "VALORE": "CS",
                        "DESCRIZIONE": "CS",
                        "DESCRIZIONE_ESTESA": "Cassa"
                    }
                    ], 
                    "selectObbLin": [{
                        "VALORE": "OBC",
                        "DESCRIZIONE": "OBB",
                        "DESCRIZIONE_ESTESA": "Obiettivo Contabile"
                    },
                    {
                        "VALORE": "LIN",
                        "DESCRIZIONE": "LIN",
                        "DESCRIZIONE_ESTESA": "Taglio Lineare"
                    },
                    {
                        "VALORE": "PLUR",
                        "DESCRIZIONE": "PLURI",
                        "DESCRIZIONE_ESTESA": "Obiettivo Pluriennale"
                    }
                
                    ],
                    "selectClass": [{
                        "VALORE": "FB",
                        "DESCRIZIONE": "FB",
                        "DESCRIZIONE_ESTESA": "Fabbisogno"
                    },
                    {
                        "VALORE": "OI",
                        "DESCRIZIONE": "OI",
                        "DESCRIZIONE_ESTESA": "Obbligo Inderogabile"
                    },
                    {
                        "VALORE": "FL",
                        "DESCRIZIONE": "FL",
                        "DESCRIZIONE_ESTESA": "Fattore legislativo"
                    }
                    ]
                                       
                });
                return oModel 
            },

            createMockUpModel: function () {
                var oModel = new JSONModel({   
                    "WorkFlow" : [        
                        {
                          "TITLE": "Iniziato",
                          "TEXT": "L.TARTAGGIA",
                          "DATETIME": "30.06.2022 17.43",
                          "FASE": 1,
                          "STATUS": "Warning",
                          "ICON": "sap-icon://favorite"
                        }
                      ],
                    "WorkFlow2" : [        
                        {
                            "NomeSessione": "XXXX1",
                            "Esercizio": "2023",
                            "Utente": "P.PROVA",
                            "Descrizione": "INIZIATO",
                            "DataStato": "/Date(1658102400000)/",
                            "OraStato": "PT17H46M25S",
                            "Stato": 2
                            
                            
                        }
                      ],
                    "selectCpCs": [{
                        "VALORE": "CP",
                        "DESCRIZIONE": "CP",
                        "DESCRIZIONE_ESTESA": "Competenza"
                    },
                    {
                        "VALORE": "CS",
                        "DESCRIZIONE": "CS",
                        "DESCRIZIONE_ESTESA": "Cassa"
                    }
                    ], 
                    "selectObbLin": [{
                        "VALORE": "OBC",
                        "DESCRIZIONE": "OBB",
                        "DESCRIZIONE_ESTESA": "Obiettivo Contabile"
                    },
                    {
                        "VALORE": "LIN",
                        "DESCRIZIONE": "LIN",
                        "DESCRIZIONE_ESTESA": "Taglio Lineare"
                    },
                    {
                        "VALORE": "PLUR",
                        "DESCRIZIONE": "PLURI",
                        "DESCRIZIONE_ESTESA": "Obiettivo Pluriennale"
                    }
                
                    ],
                    "selectClass": [{
                        "VALORE": "FB",
                        "DESCRIZIONE": "FB",
                        "DESCRIZIONE_ESTESA": "Fabbisogno"
                    },
                    {
                        "VALORE": "OI",
                        "DESCRIZIONE": "OI",
                        "DESCRIZIONE_ESTESA": "Obbligo Inderogabile"
                    },
                    {
                        "VALORE": "FL",
                        "DESCRIZIONE": "FL",
                        "DESCRIZIONE_ESTESA": "Fattore legislativo"
                    }
                    ],
                    "StatiAccantonamento": [
                        {
                            "VALORE": "1",
                            "DESCRIZIONE" : "Iniziato"
                        },{
                            "VALORE": "2",
                            "DESCRIZIONE" : "Definizione Base Aggredibile"
                        },{
                            "VALORE": "3",
                            "DESCRIZIONE" : "Proposte Accantonamenti"
                        },{
                            "VALORE": "4",
                            "DESCRIZIONE" : "In Validazione"
                        },{
                            "VALORE": "5",
                            "DESCRIZIONE" : "Associazione STAC"
                        },{
                            "VALORE": "6",
                            "DESCRIZIONE" : "Calato in Bilancio"
                        },{
                            "VALORE": "7",
                            "DESCRIZIONE" : "Chiuso"
                        }
                    ],
                    "GestioneAccantonamento": [
                        {
                            "id" : "10522254-a171-4b66-a504-ce34857d122d",
                            "comprimibile": true,
                            "IelementoCB": "xx.xx.xx.xx",
                            "IIelementoCB": "S080181320.080202.020102",
                            "fondoCB": "RD n. 827 / 1924 art. 141 FB",
                            "anni" : ["2022","2023","2024","2025"],
                            "dispAnnoI": "20.000,00",            
                            "dispAnnoII": "",
                            "dispAnnoIII": "",
                            "dispAnnoIV": "",
                            "dispAnno2023" : "4.275,00",
                            "dispAnno2024" : "4.275,00",
                            "dispAnno2025" : "4.275,00",
                            "dispAnno2026" : "4.275,00",
                            "totAccantonamentoAnno2023" : "150,00",
                            "totAccantonamentoAnno2024" : "172,00",
                            "totAccantonamentoAnno2025" : "193,00",
                            "totAccantonamentoAnno2026" : "193,00",
                            "totAccantonamentoAnnoI": "",
                            "totAccantonamentoAnnoII": "",
                            "totAccantonamentoAnnoIII": "",
                            "totAccantonamentoAnnoIV": ""
                        },
                        {
                            "id" : "d8b3af38-c4d9-436e-8e5e-93f35172eead",
                            "comprimibile": true,
                            "IelementoCB": "xx.xx.xx.xx",
                            "IIelementoCB": "S080181901.080203.020102",
                            "fondoCB": "L n. 996 / 1970 FB",
                            "anni" : ["2022","2023","2024","2025"],
                            "dispAnnoI": "20.000,00",            
                            "dispAnnoII": "",
                            "dispAnnoIII": "",
                            "dispAnnoIV": "",
                            "dispAnno2023" : "427.379,00",
                            "dispAnno2024" : "427.379,00",
                            "dispAnno2025" : "427.379,00",
                            "dispAnno2026" : "427.379,00",
                            "totAccantonamentoAnno2023" : "15.016,00",
                            "totAccantonamentoAnno2024" : "17.161,00",
                            "totAccantonamentoAnno2025" : "19.306,00",
                            "totAccantonamentoAnno2026" : "19.306,00",
                            "totAccantonamentoAnnoI": "",
                            "totAccantonamentoAnnoII": "",
                            "totAccantonamentoAnnoIII": "",
                            "totAccantonamentoAnnoIV": ""
                        },
                        {
                            "id" : "39a89032-21bb-44b6-b1c5-7928816979be",
                            "comprimibile": true,
                            "IelementoCB": "xx.xx.xx.xx",
                            "IIelementoCB": "S080190101.080304.020102",
                            "fondoCB": "L n. 790 / 1975 FB",
                            "anni" : ["2022","2023","2024","2025"],
                            "dispAnnoI": "20.000,00",            
                            "dispAnnoII": "",
                            "dispAnnoIII": "",
                            "dispAnnoIV": "",
                            "dispAnno2023" : "14.050,00",
                            "dispAnno2024" : "14.050,00",
                            "dispAnno2025" : "14.050,00",
                            "dispAnno2026" : "14.050,00",
                            "totAccantonamentoAnno2023" : "494,00",
                            "totAccantonamentoAnno2024" : "564,00",
                            "totAccantonamentoAnno2025" : "63,00",
                            "totAccantonamentoAnno2026" : "63,00",
                            "totAccantonamentoAnnoI": "",
                            "totAccantonamentoAnnoII": "",
                            "totAccantonamentoAnnoIII": "",
                            "totAccantonamentoAnnoIV": ""
                        },
                        {
                            "id" : "e29ba9bf-52e7-40ba-a93d-761f29040154",
                            "comprimibile": true,
                            "IelementoCB": "xx.xx.xx.xx",
                            "IIelementoCB": "S080190111.080304.020102",
                            "fondoCB": "L n. 469 / 1961 art. 6, comma 4 FB",
                            "anni" : ["2022","2023","2024","2025"],
                            "dispAnnoI": "20.000,00",            
                            "dispAnnoII": "",
                            "dispAnnoIII": "",
                            "dispAnnoIV": "",
                            "dispAnno2023" : "28.854,00",
                            "dispAnno2024" : "28.854,00",
                            "dispAnno2025" : "28.854,00",
                            "dispAnno2026" : "28.854,00",
                            "totAccantonamentoAnno2023" : "1.014,00",
                            "totAccantonamentoAnno2024" : "1.159,00",
                            "totAccantonamentoAnno2025" : "1.303,00",
                            "totAccantonamentoAnno2026" : "1.303,00",
                            "totAccantonamentoAnnoI": "",
                            "totAccantonamentoAnnoII": "",
                            "totAccantonamentoAnnoIII": "",
                            "totAccantonamentoAnnoIV": ""
                        },
                        {
                            "id" : "c7664c4e-45e5-4013-b82a-e14423820dbd",
                            "comprimibile": true,
                            "IelementoCB": "xx.xx.xx.xx",
                            "IIelementoCB": "S080190112.080304.020102",
                            "fondoCB": "L n. 469 / 1961 FB",
                            "anni" : ["2022","2023","2024","2025"],
                            "dispAnnoI": "15000.00",            
                            "dispAnnoII": "",
                            "dispAnnoIII": "",
                            "dispAnnoIV": "",
                            "dispAnno2023" : "28.2856,00",
                            "dispAnno2024" : "28.2856,00",
                            "dispAnno2025" : "28.2856,00",
                            "dispAnno2026" : "28.2856,00",
                            "totAccantonamentoAnno2023" : "9.938,00",
                            "totAccantonamentoAnno2024" : "11.358,00",
                            "totAccantonamentoAnno2025" : "12.777,00",
                            "totAccantonamentoAnno2026" : "12.777,00",
                            "totAccantonamentoAnnoI": "",
                            "totAccantonamentoAnnoII": "",
                            "totAccantonamentoAnnoIII": "",
                            "totAccantonamentoAnnoIV": ""
                        },
                        {
                            "id" : "83803c73-e2eb-470b-9f8b-c73e4e776414",
                            "comprimibile": true,
                            "IelementoCB": "xx.xx.xx.xx",
                            "IIelementoCB": "S080190120.080304.020102",
                            "fondoCB": "RD n. 827 / 1924 art. 141 FB",
                            "anni" : ["2022","2023","2024","2025"],
                            "dispAnnoI": "10.000,00",            
                            "dispAnnoII": "",
                            "dispAnnoIII": "",
                            "dispAnnoIV": "",
                            "dispAnno2023" : "178.655,00",
                            "dispAnno2024" : "178.655,00",
                            "dispAnno2025" : "178.655,00",
                            "dispAnno2026" : "178.655,00",
                            "totAccantonamentoAnno2023" : "6.277,00",
                            "totAccantonamentoAnno2024" : "7.174,00",
                            "totAccantonamentoAnno2025" : "8.070,00",
                            "totAccantonamentoAnno2026" : "8.070,00",
                            "totAccantonamentoAnnoI": "",
                            "totAccantonamentoAnnoII": "",
                            "totAccantonamentoAnnoIII": "",
                            "totAccantonamentoAnnoIV": ""
                        },
                        {
                            "id" : "83803c73-e2eb-470b-9f8b-c73e4e776414",
                            "comprimibile": true,
                            "IelementoCB": "xx.xx.xx.xx",
                            "IIelementoCB": "S080190501.080304.020102",
                            "fondoCB": "DL n. 39 / 2009 art. 7, comma 4 bis, lettera A FL",
                            "anni" : ["2022","2023","2024","2025"],
                            "dispAnnoI": "10.000,00",            
                            "dispAnnoII": "",
                            "dispAnnoIII": "",
                            "dispAnnoIV": "",
                            "dispAnno2023" : "390.210,00",
                            "dispAnno2024" : "390.210,00",
                            "dispAnno2025" : "390.210,00",
                            "dispAnno2026" : "390.210,00",
                            "totAccantonamentoAnno2023" : "13.710,00",
                            "totAccantonamentoAnno2024" : "15.668,00",
                            "totAccantonamentoAnno2025" : "17.627,00",
                            "totAccantonamentoAnno2026" : "17.627,00",
                            "totAccantonamentoAnnoI": "",
                            "totAccantonamentoAnnoII": "",
                            "totAccantonamentoAnnoIII": "",
                            "totAccantonamentoAnnoIV": ""
                        },
                        {
                            "id" : "83803c73-e2eb-470b-9f8b-c73e4e776414",
                            "comprimibile": true,
                            "IelementoCB": "xx.xx.xx.xx",
                            "IIelementoCB": "S080195301.080304.020102",
                            "fondoCB": "L n. 930 / 1980 FB",
                            "anni" : ["2022","2023","2024","2025"],
                            "dispAnnoI": "10.000,00",            
                            "dispAnnoII": "",
                            "dispAnnoIII": "",
                            "dispAnnoIV": "",
                            "dispAnno2023" : "625.000,00",
                            "dispAnno2024" : "625.000,00",
                            "dispAnno2025" : "625.000,00",
                            "dispAnno2026" : "625.000,00",
                            "totAccantonamentoAnno2023" : "21.959,00",
                            "totAccantonamentoAnno2024" : "25.096,00",
                            "totAccantonamentoAnno2025" : "28.233,00",
                            "totAccantonamentoAnno2026" : "28.233,00",
                            "totAccantonamentoAnnoI": "",
                            "totAccantonamentoAnnoII": "",
                            "totAccantonamentoAnnoIII": "",
                            "totAccantonamentoAnnoIV": ""
                        },
                        {
                            "id" : "83803c73-e2eb-470b-9f8b-c73e4e776414",
                            "comprimibile": true,
                            "IelementoCB": "xx.xx.xx.xx",
                            "IIelementoCB": "S080198201.080304.020102",
                            "fondoCB": "L n. 996 / 1970 art. 16 FB",
                            "anni" : ["2022","2023","2024","2025"],
                            "dispAnnoI": "10.000,00",            
                            "dispAnnoII": "",
                            "dispAnnoIII": "",
                            "dispAnnoIV": "",
                            "dispAnno2023" : "41.076,00",
                            "dispAnno2024" : "41.076,00",
                            "dispAnno2025" : "41.076,00",
                            "dispAnno2026" : "41.076,00",
                            "totAccantonamentoAnno2023" : "1.443,00",
                            "totAccantonamentoAnno2024" : "1.649,00",
                            "totAccantonamentoAnno2025" : "1.856,00",
                            "totAccantonamentoAnno2026" : "1.856,00",
                            "totAccantonamentoAnnoI": "",
                            "totAccantonamentoAnnoII": "",
                            "totAccantonamentoAnnoIII": "",
                            "totAccantonamentoAnnoIV": ""
                        }
                
                    ],
                    "Items": [{
                            "nome": "XXXX1",
                            "anno" : "2023",
                            "amm": "080",
                            "cat": "02",
                            "ce2": "01",  
                            "ce3": "02",
                            "mis": "08",
                            "prog": "",
                            "azi" : "",
                            "class": "fb",
                            "cpCs": "cp",
                            "obbLin": "obb",
                            "da": "",
                            "a": "",
                            "importo" : "",
                            "importo1" : "70.000,00",
                            "importo2" : "80.000,00",
                            "importo3" : "90.000,00",
                            "percent1" : "",
                            "percent2" : "",
                            "percent3" : "",
                            "aDecorrere": true,
                            "allCassa": true
                        },
                        {
                            "nome": "XXXX1",
                            "anno" : "2023",
                            "amm": "080",
                            "cat": "02",
                            "ce2": "01",  
                            "ce3": "02",
                            "mis": "08",
                            "prog": "",
                            "azi" : "",
                            "class": "fb",
                            "cpCs": "cp",
                            "obbLin": "pluri",
                            "da": "2027",
                            "a": "2030",
                            "importo" : "25.000,00",
                            "importo1" : "",
                            "importo2" : "",
                            "importo3" : "",
                            "percent1" : "",
                            "percent2" : "",
                            "percent3" : "",
                            "aDecorrere": false,
                            "allCassa": false
                            
                        },
                        {
                            "nome": "XXXX1",
                            "anno" : "2023",
                            "amm": "080",
                            "cat": "02",
                            "ce2": "01",  
                            "ce3": "02",
                            "mis": "08",
                            "prog": "",
                            "azi" : "",
                            "class": "fb",
                            "cpCs": "cs",
                            "obbLin": "lin",
                            "da": "",
                            "a": "",
                            "importo" : "",
                            "importo1" : "",
                            "importo2" : "",
                            "importo3" : "",
                            "percent1" : "10",
                            "percent2" : "15",
                            "percent3" : "20",
                            "aDecorrere": false,
                            "allCassa": false
                        }],
                    "ListaAccantonamenti": [{
                            "NomeSessione": "xxxxx1",
                            "Esercizio": "2023",
                            "Descrizione": "Taglio ministeri",
                            "statoWf": "Iniziato",
                            "Stato": "1",
                            "STAC" : "",
                            "NumeroSstr": "",
                            "TipoSstr" : "",
                            "AnnoSstr" : "",
                            "items" : [{
                                "nome": "xxxxx1",
                                "amm": "080",
                                "cat": "02",
                                "ce2": "01",  
                                "ce3": "02",
                                "mis": "08",
                                "prog": "",
                                "azi" : "",
                                "class": "fb",
                                "cpCs": "cp",
                                "obbLin": "obb",
                                "da": "",
                                "a": "",
                                "importo" : "",
                                "importo1" : "70.000,00",
                                "importo2" : "80.000,00",
                                "importo3" : "90.000,00",
                                "percent1" : "",
                                "percent2" : "",
                                "percent3" : "",
                                "aDecorrere": true,
                                "allCassa": true
                            },
                            {
                                "nome": "xxxxx1",
                                "amm": "080",
                                "cat": "02",
                                "ce2": "01",  
                                "ce3": "02",
                                "mis": "08",
                                "prog": "",
                                "azi" : "",
                                "class": "fb",
                                "cpCs": "cp",
                                "obbLin": "pluri",
                                "da": "2027",
                                "a": "2030",
                                "importo" : "25.000,00",
                                "importo1" : "",
                                "importo2" : "",
                                "importo3" : "",
                                "percent1" : "",
                                "percent2" : "",
                                "percent3" : "",
                                "aDecorrere": false,
                                "allCassa": false
                                
                            },
                            {
                                "nome": "xxxxx1",
                                "amm": "080",
                                "cat": "02",
                                "ce2": "01",  
                                "ce3": "02",
                                "mis": "08",
                                "prog": "",
                                "azi" : "",
                                "class": "fb",
                                "cpCs": "cs",
                                "obbLin": "lin",
                                "da": "",
                                "a": "",
                                "importo" : "",
                                "importo1" : "",
                                "importo2" : "",
                                "importo3" : "",
                                "percent1" : "10",
                                "percent2" : "15",
                                "percent3" : "20",
                                "aDecorrere": false,
                                "allCassa": false
                            }]
                        },
                        {
                            "NomeSessione": "xxxxx2",
                            "Esercizio": "2023",
                            "Descrizione": "c b a",
                            "statoWf": "Associazione STAC",
                            "Stato": "6",
                            "STAC" : "STAC - 2023 - 48",
                            "NumeroSstr": "48",
                            "TipoSstr" : "STAC",
                            "AnnoSstr" : "2023",
                            "items" : [{
                                "nome": "xxxxx2",
                                "amm": "010",
                                "cat": "2",
                                "ce2": "1",  
                                "ce3": "1",
                                "mis": "01",
                                "prog": "01",
                                "azi" : "03",
                                "class": "fb",
                                "cpCs": "cp",
                                "obbLin": "obb",
                                "da": "",
                                "a": "",
                                "importo" : "25.000,00",
                                "importo1" : "70.000,00",
                                "importo2" : "80.000,00",
                                "importo3" : "90.000,00",
                                "percent1" : "10",
                                "percent2" : "15",
                                "percent3" : "20",
                                "aDecorrere": true,
                                "allCassa": true
                            },
                            {
                                "nome": "xxxxx2",
                                "amm": "020",
                                "cat": "2",
                                "ce2": "2",  
                                "ce3": "2",
                                "azi" : "03",
                                "class": "fb",
                                "cpCs": "cp",
                                "obbLin": "obb",
                                "da": "",
                                "a": "",
                                "importo" : "25.000,00",
                                "importo1" : "",
                                "importo2" : "",
                                "importo3" : "",
                                "percent1" : "",
                                "percent2" : "",
                                "percent3" : "",
                                "aDecorrere": true,
                                "allCassa": true
                                
                            },
                            {
                                "nome": "xxxxx2",
                                "amm": "030",
                                "cat": "2",
                                "ce2": "1",  
                                "ce3": "",
                                "mis": "",
                                "azi" : "03",
                                "class": "fb",
                                "cpCs": "cp",
                                "obbLin": "obb",
                                "da": "",
                                "a": "",
                                "importo" : "25.000,00",
                                "importo1" : "",
                                "importo2" : "",
                                "importo3" : "",
                                "percent1" : "",
                                "percent2" : "",
                                "percent3" : "",
                                "aDecorrere": true,
                                "allCassa": true
                            }]   
                        },{
                            "NomeSessione": "xxxxx3",
                            "Esercizio": "2023",
                            "Descrizione": "a c g",
                            "statoWf": "Proposte Accantonamenti" ,
                            "Stato": "3",
                            "STAC" : "",
                            "NumeroSstr": "",
                            "TipoSstr" : "",
                            "AnnoSstr" : "",
                            "items" : [{
                                "nome": "xxxxx3",
                                "amm": "010",
                                "cat": "2",
                                "ce2": "1",  
                                "ce3": "1",
                                "mis": "01",
                                "prog": "01",
                                "azi" : "03",
                                "class": "fb",
                                "cpCs": "cp",
                                "obbLin": "obb",
                                "da": "",
                                "a": "",
                                "importo" : "25.000,00",
                                "importo1" : "70.000,00",
                                "importo2" : "80.000,00",
                                "importo3" : "90.000,00",
                                "percent1" : "10",
                                "percent2" : "15",
                                "percent3" : "20",
                                "aDecorrere": true,
                                "allCassa": true
                            },
                            {
                                "nome": "xxxxx3",
                                "amm": "020",
                                "cat": "2",
                                "ce2": "2",  
                                "ce3": "2",
                                "azi" : "03",
                                "class": "fb",
                                "cpCs": "cp",
                                "obbLin": "obb",
                                "da": "",
                                "a": "",
                                "importo" : "25.000,00",
                                "importo1" : "",
                                "importo2" : "",
                                "importo3" : "",
                                "percent1" : "",
                                "percent2" : "",
                                "percent3" : "",
                                "aDecorrere": true,
                                "allCassa": true
                                
                            },
                            {
                                "nome": "xxxxx3",
                                "amm": "030",
                                "cat": "2",
                                "ce2": "1",  
                                "ce3": "",
                                "mis": "",
                                "azi" : "03",
                                "class": "fb",
                                "cpCs": "cp",
                                "obbLin": "obb",
                                "da": "",
                                "a": "",
                                "importo" : "25.000,00",
                                "importo1" : "",
                                "importo2" : "",
                                "importo3" : "",
                                "percent1" : "",
                                "percent2" : "",
                                "percent3" : "",
                                "aDecorrere": true,
                                "allCassa": true
                            }]
                        },{
                            "NomeSessione": "xxxxx4",
                            "Esercizio": "2023",
                            "Descrizione": "Test Chiuso",
                            "statoWf": "Chiuso",
                            "Stato": "7",
                            "STAC" : "",
                            "items" : [{
                                "nome": "xxxxx1",
                                "amm": "010",
                                "cat": "2",
                                "ce2": "1",  
                                "ce3": "1",
                                "mis": "01",
                                "prog": "01",
                                "azi" : "03",
                                "class": "fb",
                                "cpCs": "cp",
                                "obbLin": "obb",
                                "da": "",
                                "a": "",
                                "importo" : "",
                                "importo1" : "70.000,00",
                                "importo2" : "80.000,00",
                                "importo3" : "90.000,00",
                                "percent1" : "",
                                "percent2" : "",
                                "percent3" : "",
                                "aDecorrere": true,
                                "allCassa": true
                            },
                            {
                                "nome": "xxxxx1",
                                "amm": "020",
                                "cat": "2",
                                "ce2": "2",  
                                "ce3": "2",
                                "azi" : "03",
                                "class": "fb",
                                "cpCs": "cp",
                                "obbLin": "pluri",
                                "da": "2023",
                                "a": "2037",
                                "importo" : "25.000,00",
                                "importo1" : "",
                                "importo2" : "",
                                "importo3" : "",
                                "percent1" : "",
                                "percent2" : "",
                                "percent3" : "",
                                "aDecorrere": false,
                                "allCassa": false
                                
                            },
                            {
                                "nome": "xxxxx1",
                                "amm": "030",
                                "cat": "2",
                                "ce2": "1",  
                                "ce3": "",
                                "mis": "",
                                "azi" : "03",
                                "class": "fb",
                                "cpCs": "cs",
                                "obbLin": "lin",
                                "da": "",
                                "a": "",
                                "importo" : "",
                                "importo1" : "",
                                "importo2" : "",
                                "importo3" : "",
                                "percent1" : "10",
                                "percent2" : "15",
                                "percent3" : "20",
                                "aDecorrere": false,
                                "allCassa": false
                            }]}
                    ]
                });
                return oModel 
            }
    };
});