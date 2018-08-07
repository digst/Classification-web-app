# Classification-web-app

Files for a HTML web-app, giving GUI access to the classification service

Demo-projekt:
Formål:
1. At teste VocBench som hjemsted for fællesoffentlige klassifikationer
2. At demonstrere en REST-interface til en klassifikationsservice
3. At demonstrere en web-app som udstilling og adgang til klassifikationer

Arkitekturkomponenter:
Klassifikations-service-arkitekturen er baseret på samspil mellem en række web-baserede applikationer.

rdf4j:
Klassifikationerne opbevares i en triple-store i en rdf4j (tidl. Open Sesame) database. rdf4j udstiller et SPARQL-adgangspunkt, som tilgås af VocBench og GRLC
SPARQL-endpoint: http://83.169.40.208:8081/rdf4j-server/repositories/vb1

VocBench:
VocBench er den grafiske adgang til redaktion af klassifikationerne, VocBench opretholder brugerstyring, versionering og intregritet af klassifikationerne.
Alle de offentlige klassifikationer opbevares i samme 'project' i VocBench.
VocBench adgang: http://vocbench.rdfined.dk:8080/vocbench3

grlc:
grlc genererer et REST-API med læse-adgang til klassifikationerne. grlc fortolker en række SPARQL-queries, lagret på GitHub og udstiller hver af disse som en REST-ressurce.
grlc genererer yderligere en swagger-GUI til dokumentation af REST-servicen og en web-service specifikationsfil overholdende Swagger 2.0 = OpenApi 2.0
grlc-projektet http://grlc.io
Dokumentation: 
GitHub: 
På github lagres e SPARQL-queries, som grlc oversætter til REST-ressurcer.
GitHub varetager bruger- og versionsstyring.
https://github.com/digst/Classification



Adgang:
Fremtid:
