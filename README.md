# Classification-web-app

Files for a HTML web-app, giving GUI access to the classification service

# Demo-projekt:
## Formål:
1. At teste VocBench som hjemsted for fællesoffentlige klassifikationer
2. At demonstrere en REST-interface til en klassifikationsservice
3. At demonstrere en web-app som udstilling og adgang til klassifikationer

## Adgang:
Brugere kan tilgå klassifikationer gennem tre kanaler:
+ Klassifikationsredaktører arbejder med deres klassifikationer i VocBenc brugerinterfacet.
+ Klassifikationsbrugere kan se og downloade klassifikationer fra web-appen på http://data.gov.dk/classification
+ Udviklere kan anvende REST-servicen på http://grlc.io/api/digst/classification, hvor de enkelte REST-methods beskrives nøjere

![alt text](https://github.com/digst/Classification-web-app/blob/master/klassifikationsservice.png "Langhårede deltagere foretrækkes")

## Arkitekturkomponenter: 
Klassifikations-service-arkitekturen er baseret på samspil mellem en række web-baserede applikationer.

### rdf4j:
Klassifikationerne opbevares i en triple-store i en rdf4j (tidl. Open Sesame) database. rdf4j udstiller et SPARQL-adgangspunkt, som tilgås af VocBench og GRLC
+ SPARQL-endpoint: http://83.169.40.208:8081/rdf4j-server/repositories/vb1

### VocBench:
VocBench er den grafiske adgang til redaktion af klassifikationerne, VocBench opretholder brugerstyring, versionering og intregritet af klassifikationerne. 
Alle de offentlige klassifikationer opbevares i samme 'project' i VocBench. 
+ VocBench adgang: http://vocbench.rdfined.dk:8080/vocbench3

### grlc:
grlc genererer et REST-API med læse-adgang til klassifikationerne. grlc fortolker en række SPARQL-queries, lagret på GitHub og udstiller hver af disse som en REST-ressurce. 
grlc genererer yderligere en swagger-GUI til dokumentation af REST-servicen og en web-service specifikationsfil overholdende Swagger 2.0 = OpenApi 2.0
+ grlc-projektet http://grlc.io
+ Spec. fil: http://grlc.io/api/digst/classification/spec
+ Dokumentation: http://grlc.io/api/digst/classification

Swagger-GUI'en er glimrende dokumentation af REST-servicen, her kan de enkelte ressourcer/methods testes. Man kan indsætte parametre hvor relevant og afprøve kaldet enten med cURL eller i en browser. (bemærk, at de forespørgsler, som GUI'et anvender samt dem, som det foreslår til cURL-anvendelse er baseret på Accept-headere (svarformat), som ikke understøttes af SPARQL-serveren. Brug i stedet "accept: application/rdf+xml" eller forsøg med browser-strengen, hvor svarformat er uspecificeret)

### GitHub: 
På github lagres de SPARQL-queries, som grlc oversætter til REST-ressurcer.
GitHub varetager bruger- og versionsstyring.
+ https://github.com/digst/Classification

### Klassifikations-web-app:
Web-appen giver kikke-adgang til klassifikationerne, disse vises på liste og kan udfoldes til et træ og en tabel over elementer. Komplette klassifikatoner og enkeltelementer kan downloades som RDF/XML. 
+ Web-appen er placeret på: http://data.gov.dk/classification
+ Kildekode på: https://github.com/digst/Classification-web-app


## Fremtid:
Den foreliggende arkitektur er en demo af intenderet funktionalitet.
Hvis arkitekturen skal konsolideres, kunne man med fordel anvende en egen instans af grlc, fordelagtigt drevet i en Docker-container. På denne måde ville URL'er blive mere hjemlige, således at REST-servicen og dens dokumentation ville kunne findes på http://data.gov.dk/classification frem for på http://grlc.io/digst/classification.
Web-appen er for indeværende en svag skitse af, hvilken funktionalitet man kunne tænke sig at udbyde. Især hvis FORM skal udstilles her vil yderligere udvikling være på sin plads. De anvendt javascript-biblioteker - D3 Data-Driven Documents og jQuery-DataTables - er yderst fleksible og kan tilføjes megen relevant funktionalitet.
