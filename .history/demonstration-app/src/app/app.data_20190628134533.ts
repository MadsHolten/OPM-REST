export class AppData {

    public spaceTriples = 
`@prefix inst: <http://localhost:3000/duplex/arch/spaces/> .
@prefix bot: <https://w3id.org/bot#> .

inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ff9f a bot:Space .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa2 a bot:Space .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa5 a bot:Space .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa8 a bot:Space .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb1 a bot:Space .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb5 a bot:Space .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb8 a bot:Space .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffbb a bot:Space .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-000301fe a bot:Space .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030201 a bot:Space .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030204 a bot:Space .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030207 a bot:Space .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0003020d a bot:Space .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030211 a bot:Space .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030214 a bot:Space .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030217 a bot:Space .
inst:aa6e13ea-b5bc-4245-93bf-8b2355872cb5-00031f6a a bot:Space .
inst:aa6e13ea-b5bc-4245-93bf-8b2355872cb5-00031f79 a bot:Space .
inst:40c2d70d-8d3b-49a9-9702-6756a4ed76b3-0003364e a bot:Space .
inst:40c2d70d-8d3b-49a9-9702-6756a4ed76b3-00033781 a bot:Space .
inst:335fc1b3-63ca-474d-9c21-6d5abbdb0485-00033925 a bot:Space .`;

    public spaceNameTriples =
`@prefix inst: <http://localhost:3000/duplex/arch/spaces/> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ff9f rdfs:label "Living Room"^^xsd:string .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa2 rdfs:label "Kitchen"^^xsd:string .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa5 rdfs:label "Bathroom 1"^^xsd:string .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa8 rdfs:label "Foyer"^^xsd:string .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb1 rdfs:label "Hallway"^^xsd:string .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb5 rdfs:label "Bathroom 2"^^xsd:string .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb8 rdfs:label "Bedroom 2"^^xsd:string .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffbb rdfs:label "Bedroom 1"^^xsd:string .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-000301fe rdfs:label "Living Room"^^xsd:string .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030201 rdfs:label "Kitchen"^^xsd:string .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030204 rdfs:label "Bathroom 1"^^xsd:string .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030207 rdfs:label "Foyer"^^xsd:string .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0003020d rdfs:label "Hallway"^^xsd:string .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030211 rdfs:label "Bathroom 2"^^xsd:string .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030214 rdfs:label "Bedroom 2"^^xsd:string .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030217 rdfs:label "Bedroom 1"^^xsd:string .
inst:aa6e13ea-b5bc-4245-93bf-8b2355872cb5-00031f6a rdfs:label "Utility"^^xsd:string .
inst:aa6e13ea-b5bc-4245-93bf-8b2355872cb5-00031f79 rdfs:label "Utility"^^xsd:string .
inst:40c2d70d-8d3b-49a9-9702-6756a4ed76b3-0003364e rdfs:label "Stair"^^xsd:string .
inst:40c2d70d-8d3b-49a9-9702-6756a4ed76b3-00033781 rdfs:label "Room"^^xsd:string .
inst:335fc1b3-63ca-474d-9c21-6d5abbdb0485-00033925 rdfs:label "Roof"^^xsd:string .`;

    public spaceAreasTriples =
`@prefix inst: <http://localhost:3000/duplex/arch/spaces/> .
@prefix props: <https://w3id.org/props#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ff9f props:area "30.14164525"^^xsd:decimal .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa2 props:area "13.8894142"^^xsd:decimal .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa5 props:area "4.0444008"^^xsd:decimal .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa8 props:area "17.8975558116"^^xsd:decimal .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb1 props:area "7.7999547"^^xsd:decimal .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb5 props:area "5.740548"^^xsd:decimal .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb8 props:area "26.17799425"^^xsd:decimal .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffbb props:area "26.11931425"^^xsd:decimal .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-000301fe props:area "30.14164525"^^xsd:decimal .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030201 props:area "14.6277322"^^xsd:decimal .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030204 props:area "4.7968008"^^xsd:decimal .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030207 props:area "16.40695675"^^xsd:decimal .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0003020d props:area "7.5093385"^^xsd:decimal .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030211 props:area "5.740548"^^xsd:decimal .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030214 props:area "26.81958275"^^xsd:decimal .
inst:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030217 props:area "26.11931425"^^xsd:decimal .
inst:aa6e13ea-b5bc-4245-93bf-8b2355872cb5-00031f6a props:area "1.42932"^^xsd:decimal .
inst:aa6e13ea-b5bc-4245-93bf-8b2355872cb5-00031f79 props:area "1.42932"^^xsd:decimal .
inst:40c2d70d-8d3b-49a9-9702-6756a4ed76b3-0003364e props:area "4.9221725"^^xsd:decimal .
inst:40c2d70d-8d3b-49a9-9702-6756a4ed76b3-00033781 props:area "4.9221725"^^xsd:decimal .
inst:335fc1b3-63ca-474d-9c21-6d5abbdb0485-00033925 props:area "145.721689"^^xsd:decimal .`;

    public wallTriples =
`@prefix inst: <http://localhost:3000/duplex/arch/walls/> .
@prefix bot: <https://w3id.org/bot#> .

inst:9808fd7f-dc48-478e-9217-628e833f66bf-00021b4e a bot:Element .
inst:9808fd7f-dc48-478e-9217-628e833f66bf-00021bad a bot:Element .
inst:9808fd7f-dc48-478e-9217-628e833f66bf-00021bfd a bot:Element .
inst:9808fd7f-dc48-478e-9217-628e833f66bf-00021c46 a bot:Element .
inst:9808fd7f-dc48-478e-9217-628e833f66bf-00021d58 a bot:Element .
inst:9808fd7f-dc48-478e-9217-628e833f66bf-00021f87 a bot:Element .
inst:9808fd7f-dc48-478e-9217-628e833f66bf-00021fe2 a bot:Element .
inst:9808fd7f-dc48-478e-9217-628e833f66bf-00022053 a bot:Element .
inst:9808fd7f-dc48-478e-9217-628e833f66bf-0002206e a bot:Element .
inst:9808fd7f-dc48-478e-9217-628e833f66bf-000221a2 a bot:Element .
inst:9808fd7f-dc48-478e-9217-628e833f66bf-00022207 a bot:Element .
inst:9808fd7f-dc48-478e-9217-628e833f66bf-000222a3 a bot:Element .
inst:9808fd7f-dc48-478e-9217-628e833f66bf-000224bf a bot:Element .
inst:9808fd7f-dc48-478e-9217-628e833f66bf-000224e8 a bot:Element .
inst:9808fd7f-dc48-478e-9217-628e833f66bf-0002250a a bot:Element .
inst:9808fd7f-dc48-478e-9217-628e833f66bf-0002253a a bot:Element .
inst:9808fd7f-dc48-478e-9217-628e833f66bf-00022671 a bot:Element .
inst:9808fd7f-dc48-478e-9217-628e833f66bf-000226bb a bot:Element .
inst:9808fd7f-dc48-478e-9217-628e833f66bf-000226da a bot:Element .
inst:9808fd7f-dc48-478e-9217-628e833f66bf-00022f87 a bot:Element .
inst:9808fd7f-dc48-478e-9217-628e833f66bf-00023032 a bot:Element .
inst:9808fd7f-dc48-478e-9217-628e833f66bf-00023076 a bot:Element .
inst:9808fd7f-dc48-478e-9217-628e833f66bf-000230ae a bot:Element .
inst:9808fd7f-dc48-478e-9217-628e833f66bf-000230e6 a bot:Element .
inst:9808fd7f-dc48-478e-9217-628e833f66bf-000231f0 a bot:Element .
inst:9808fd7f-dc48-478e-9217-628e833f66bf-00023231 a bot:Element .
inst:9808fd7f-dc48-478e-9217-628e833f66bf-00023258 a bot:Element .
inst:9808fd7f-dc48-478e-9217-628e833f66bf-0002330a a bot:Element .
inst:9808fd7f-dc48-478e-9217-628e833f66bf-000233ad a bot:Element .
inst:9808fd7f-dc48-478e-9217-628e833f66bf-00023486 a bot:Element .
inst:9808fd7f-dc48-478e-9217-628e833f66bf-000234ca a bot:Element .
inst:9808fd7f-dc48-478e-9217-628e833f66bf-000234f9 a bot:Element .
inst:9808fd7f-dc48-478e-9217-628e833f66bf-0002352c a bot:Element .
inst:9808fd7f-dc48-478e-9217-628e833f66bf-0002358f a bot:Element .
inst:2da40d62-4698-436c-a2c3-95c49bb5de4c-0002d270 a bot:Element .
inst:2da40d62-4698-436c-a2c3-95c49bb5de4c-0002d2b6 a bot:Element .
inst:2da40d62-4698-436c-a2c3-95c49bb5de4c-0002d2e8 a bot:Element .
inst:2da40d62-4698-436c-a2c3-95c49bb5de4c-0002d30d a bot:Element .
inst:2c391822-07f8-4a22-86a8-a1e574103a53-0002e292 a bot:Element .
inst:2c391822-07f8-4a22-86a8-a1e574103a53-0002e5cd a bot:Element .
inst:2c391822-07f8-4a22-86a8-a1e574103a53-0002e6bc a bot:Element .
inst:2c391822-07f8-4a22-86a8-a1e574103a53-0002e936 a bot:Element .
inst:2c391822-07f8-4a22-86a8-a1e574103a53-0002e9d5 a bot:Element .
inst:27ece05c-f06c-4dd2-9ccd-945e525b89d5-0002f2df a bot:Element .
inst:27ece05c-f06c-4dd2-9ccd-945e525b89d5-0002f676 a bot:Element .
inst:64b7f7d3-8cfc-4277-ba33-8de2e6502424-00031a53 a bot:Element .
inst:64b7f7d3-8cfc-4277-ba33-8de2e6502424-00031cde a bot:Element .
inst:64b7f7d3-8cfc-4277-ba33-8de2e6502424-00031e0c a bot:Element .
inst:64b7f7d3-8cfc-4277-ba33-8de2e6502424-00031ecd a bot:Element .
inst:e21226ef-c42d-4907-9a6f-46644e16769a-00035146 a bot:Element .
inst:e21226ef-c42d-4907-9a6f-46644e16769a-00035147 a bot:Element .
inst:e21226ef-c42d-4907-9a6f-46644e16769a-00035148 a bot:Element .
inst:e21226ef-c42d-4907-9a6f-46644e16769a-00035149 a bot:Element .
inst:e21226ef-c42d-4907-9a6f-46644e16769a-000351e9 a bot:Element .
inst:e21226ef-c42d-4907-9a6f-46644e16769a-000351ea a bot:Element .
inst:e21226ef-c42d-4907-9a6f-46644e16769a-000351eb a bot:Element .
inst:e21226ef-c42d-4907-9a6f-46644e16769a-000351ec a bot:Element .`;

    public adjWallTriples =
`@prefix sp: <http://localhost:3000/duplex/arch/spaces/> .
@prefix el: <http://localhost:3000/duplex/arch/walls/> .
@prefix bot: <https://w3id.org/bot#> .

sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ff9f bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00021bfd .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ff9f bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00021c46 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ff9f bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000222a3 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ff9f bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-0002250a .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ff9f bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-0002253a .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa2 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00021c46 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa2 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00022053 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa2 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000221a2 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa2 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00022207 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa2 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-0002253a .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa2 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000226bb .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa2 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00023486 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa2 bot:adjacentElement el:2c391822-07f8-4a22-86a8-a1e574103a53-0002e936 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa2 bot:adjacentElement el:2c391822-07f8-4a22-86a8-a1e574103a53-0002e9d5 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa5 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00021fe2 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa5 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00022053 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa5 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-0002206e .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa5 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000221a2 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa5 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00022207 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa5 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00022671 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa5 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000226bb .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa5 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000226da .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa5 bot:adjacentElement el:2c391822-07f8-4a22-86a8-a1e574103a53-0002e936 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa5 bot:adjacentElement el:2c391822-07f8-4a22-86a8-a1e574103a53-0002e9d5 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa8 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00021bad .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa8 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00021bfd .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa8 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00021fe2 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa8 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000221a2 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa8 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00022207 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa8 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000222a3 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa8 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000224e8 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa8 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-0002250a .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa8 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00022671 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa8 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00023486 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa8 bot:adjacentElement el:64b7f7d3-8cfc-4277-ba33-8de2e6502424-00031ecd .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb1 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00021bad .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb1 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00023076 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb1 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00023486 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb1 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000234ca .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb1 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000234f9 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb1 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-0002352c .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb1 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-0002358f .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb1 bot:adjacentElement el:2da40d62-4698-436c-a2c3-95c49bb5de4c-0002d2b6 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb1 bot:adjacentElement el:64b7f7d3-8cfc-4277-ba33-8de2e6502424-00031cde .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb1 bot:adjacentElement el:64b7f7d3-8cfc-4277-ba33-8de2e6502424-00031ecd .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb1 bot:adjacentElement el:e21226ef-c42d-4907-9a6f-46644e16769a-00035146 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb1 bot:adjacentElement el:e21226ef-c42d-4907-9a6f-46644e16769a-00035147 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb1 bot:adjacentElement el:e21226ef-c42d-4907-9a6f-46644e16769a-00035148 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb1 bot:adjacentElement el:e21226ef-c42d-4907-9a6f-46644e16769a-00035149 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb5 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00022f87 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb5 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000234ca .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb5 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-0002358f .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb5 bot:adjacentElement el:27ece05c-f06c-4dd2-9ccd-945e525b89d5-0002f2df .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb5 bot:adjacentElement el:64b7f7d3-8cfc-4277-ba33-8de2e6502424-00031cde .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb8 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00021bad .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb8 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00021bfd .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb8 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00022f87 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb8 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00023076 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb8 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000230ae .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb8 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00023486 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb8 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000234ca .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb8 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-0002358f .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb8 bot:adjacentElement el:27ece05c-f06c-4dd2-9ccd-945e525b89d5-0002f2df .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb8 bot:adjacentElement el:64b7f7d3-8cfc-4277-ba33-8de2e6502424-00031ecd .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffbb bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00021b4e .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffbb bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00021bad .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffbb bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00022f87 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffbb bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00023032 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffbb bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00023076 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffbb bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000234ca .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffbb bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000234f9 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffbb bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-0002352c .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffbb bot:adjacentElement el:27ece05c-f06c-4dd2-9ccd-945e525b89d5-0002f2df .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffbb bot:adjacentElement el:e21226ef-c42d-4907-9a6f-46644e16769a-00035146 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffbb bot:adjacentElement el:e21226ef-c42d-4907-9a6f-46644e16769a-00035147 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffbb bot:adjacentElement el:e21226ef-c42d-4907-9a6f-46644e16769a-00035149 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-000301fe bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00021b4e .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-000301fe bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00021bad .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-000301fe bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00021d58 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-000301fe bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000224bf .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-000301fe bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000224e8 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030201 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00021bad .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030201 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00021f87 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030201 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00021fe2 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030201 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000224e8 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030201 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00022671 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030201 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000231f0 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030201 bot:adjacentElement el:2c391822-07f8-4a22-86a8-a1e574103a53-0002e292 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030201 bot:adjacentElement el:2c391822-07f8-4a22-86a8-a1e574103a53-0002e5cd .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030201 bot:adjacentElement el:2c391822-07f8-4a22-86a8-a1e574103a53-0002e6bc .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030204 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00021f87 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030204 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00021fe2 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030204 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00022053 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030204 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-0002206e .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030204 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00022671 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030204 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000226bb .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030204 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000226da .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030204 bot:adjacentElement el:2c391822-07f8-4a22-86a8-a1e574103a53-0002e292 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030204 bot:adjacentElement el:2c391822-07f8-4a22-86a8-a1e574103a53-0002e5cd .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030204 bot:adjacentElement el:2c391822-07f8-4a22-86a8-a1e574103a53-0002e6bc .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030207 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00021b4e .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030207 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00021c46 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030207 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00021d58 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030207 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00021f87 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030207 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00022053 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030207 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000224bf .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030207 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-0002253a .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030207 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000226bb .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030207 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000231f0 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030207 bot:adjacentElement el:2c391822-07f8-4a22-86a8-a1e574103a53-0002e6bc .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030207 bot:adjacentElement el:64b7f7d3-8cfc-4277-ba33-8de2e6502424-00031e0c .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0003020d bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00021c46 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0003020d bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000230e6 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0003020d bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000231f0 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0003020d bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00023231 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0003020d bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00023258 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0003020d bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-0002330a .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0003020d bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000233ad .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0003020d bot:adjacentElement el:2da40d62-4698-436c-a2c3-95c49bb5de4c-0002d30d .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0003020d bot:adjacentElement el:64b7f7d3-8cfc-4277-ba33-8de2e6502424-00031a53 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0003020d bot:adjacentElement el:64b7f7d3-8cfc-4277-ba33-8de2e6502424-00031e0c .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0003020d bot:adjacentElement el:e21226ef-c42d-4907-9a6f-46644e16769a-000351e9 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0003020d bot:adjacentElement el:e21226ef-c42d-4907-9a6f-46644e16769a-000351ea .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0003020d bot:adjacentElement el:e21226ef-c42d-4907-9a6f-46644e16769a-000351eb .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0003020d bot:adjacentElement el:e21226ef-c42d-4907-9a6f-46644e16769a-000351ec .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030211 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00022f87 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030211 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00023231 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030211 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-0002330a .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030211 bot:adjacentElement el:2c391822-07f8-4a22-86a8-a1e574103a53-0002e5cd .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030211 bot:adjacentElement el:27ece05c-f06c-4dd2-9ccd-945e525b89d5-0002f676 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030211 bot:adjacentElement el:64b7f7d3-8cfc-4277-ba33-8de2e6502424-00031a53 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030214 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00021b4e .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030214 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00021c46 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030214 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00022f87 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030214 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00023032 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030214 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000230e6 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030214 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000231f0 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030214 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00023231 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030214 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-0002330a .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030214 bot:adjacentElement el:27ece05c-f06c-4dd2-9ccd-945e525b89d5-0002f676 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030214 bot:adjacentElement el:64b7f7d3-8cfc-4277-ba33-8de2e6502424-00031e0c .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030217 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00021bfd .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030217 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00021c46 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030217 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00022f87 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030217 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000230ae .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030217 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000230e6 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030217 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00023231 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030217 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00023258 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030217 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000233ad .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030217 bot:adjacentElement el:27ece05c-f06c-4dd2-9ccd-945e525b89d5-0002f676 .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030217 bot:adjacentElement el:e21226ef-c42d-4907-9a6f-46644e16769a-000351ea .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030217 bot:adjacentElement el:e21226ef-c42d-4907-9a6f-46644e16769a-000351eb .
sp:0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030217 bot:adjacentElement el:e21226ef-c42d-4907-9a6f-46644e16769a-000351ec .
sp:aa6e13ea-b5bc-4245-93bf-8b2355872cb5-00031f6a bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00022f87 .
sp:aa6e13ea-b5bc-4245-93bf-8b2355872cb5-00031f6a bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000234ca .
sp:aa6e13ea-b5bc-4245-93bf-8b2355872cb5-00031f6a bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-0002352c .
sp:aa6e13ea-b5bc-4245-93bf-8b2355872cb5-00031f6a bot:adjacentElement el:27ece05c-f06c-4dd2-9ccd-945e525b89d5-0002f2df .
sp:aa6e13ea-b5bc-4245-93bf-8b2355872cb5-00031f6a bot:adjacentElement el:64b7f7d3-8cfc-4277-ba33-8de2e6502424-00031cde .
sp:aa6e13ea-b5bc-4245-93bf-8b2355872cb5-00031f79 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00022f87 .
sp:aa6e13ea-b5bc-4245-93bf-8b2355872cb5-00031f79 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00023231 .
sp:aa6e13ea-b5bc-4245-93bf-8b2355872cb5-00031f79 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000233ad .
sp:aa6e13ea-b5bc-4245-93bf-8b2355872cb5-00031f79 bot:adjacentElement el:2c391822-07f8-4a22-86a8-a1e574103a53-0002e5cd .
sp:aa6e13ea-b5bc-4245-93bf-8b2355872cb5-00031f79 bot:adjacentElement el:27ece05c-f06c-4dd2-9ccd-945e525b89d5-0002f676 .
sp:aa6e13ea-b5bc-4245-93bf-8b2355872cb5-00031f79 bot:adjacentElement el:64b7f7d3-8cfc-4277-ba33-8de2e6502424-00031a53 .
sp:40c2d70d-8d3b-49a9-9702-6756a4ed76b3-0003364e bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00021bad .
sp:40c2d70d-8d3b-49a9-9702-6756a4ed76b3-0003364e bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00021fe2 .
sp:40c2d70d-8d3b-49a9-9702-6756a4ed76b3-0003364e bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000224e8 .
sp:40c2d70d-8d3b-49a9-9702-6756a4ed76b3-0003364e bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00022671 .
sp:40c2d70d-8d3b-49a9-9702-6756a4ed76b3-0003364e bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00023076 .
sp:40c2d70d-8d3b-49a9-9702-6756a4ed76b3-0003364e bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00023486 .
sp:40c2d70d-8d3b-49a9-9702-6756a4ed76b3-0003364e bot:adjacentElement el:64b7f7d3-8cfc-4277-ba33-8de2e6502424-00031ecd .
sp:40c2d70d-8d3b-49a9-9702-6756a4ed76b3-00033781 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00021c46 .
sp:40c2d70d-8d3b-49a9-9702-6756a4ed76b3-00033781 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00022053 .
sp:40c2d70d-8d3b-49a9-9702-6756a4ed76b3-00033781 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-0002253a .
sp:40c2d70d-8d3b-49a9-9702-6756a4ed76b3-00033781 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000226bb .
sp:40c2d70d-8d3b-49a9-9702-6756a4ed76b3-00033781 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000230e6 .
sp:40c2d70d-8d3b-49a9-9702-6756a4ed76b3-00033781 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000231f0 .
sp:40c2d70d-8d3b-49a9-9702-6756a4ed76b3-00033781 bot:adjacentElement el:64b7f7d3-8cfc-4277-ba33-8de2e6502424-00031e0c .
sp:335fc1b3-63ca-474d-9c21-6d5abbdb0485-00033925 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00022f87 .
sp:335fc1b3-63ca-474d-9c21-6d5abbdb0485-00033925 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00023032 .
sp:335fc1b3-63ca-474d-9c21-6d5abbdb0485-00033925 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00023076 .
sp:335fc1b3-63ca-474d-9c21-6d5abbdb0485-00033925 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000230ae .
sp:335fc1b3-63ca-474d-9c21-6d5abbdb0485-00033925 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000230e6 .
sp:335fc1b3-63ca-474d-9c21-6d5abbdb0485-00033925 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000231f0 .
sp:335fc1b3-63ca-474d-9c21-6d5abbdb0485-00033925 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00023231 .
sp:335fc1b3-63ca-474d-9c21-6d5abbdb0485-00033925 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00023258 .
sp:335fc1b3-63ca-474d-9c21-6d5abbdb0485-00033925 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-0002330a .
sp:335fc1b3-63ca-474d-9c21-6d5abbdb0485-00033925 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000233ad .
sp:335fc1b3-63ca-474d-9c21-6d5abbdb0485-00033925 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-00023486 .
sp:335fc1b3-63ca-474d-9c21-6d5abbdb0485-00033925 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000234ca .
sp:335fc1b3-63ca-474d-9c21-6d5abbdb0485-00033925 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-000234f9 .
sp:335fc1b3-63ca-474d-9c21-6d5abbdb0485-00033925 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-0002352c .
sp:335fc1b3-63ca-474d-9c21-6d5abbdb0485-00033925 bot:adjacentElement el:9808fd7f-dc48-478e-9217-628e833f66bf-0002358f .
sp:335fc1b3-63ca-474d-9c21-6d5abbdb0485-00033925 bot:adjacentElement el:2da40d62-4698-436c-a2c3-95c49bb5de4c-0002d270 .
sp:335fc1b3-63ca-474d-9c21-6d5abbdb0485-00033925 bot:adjacentElement el:2da40d62-4698-436c-a2c3-95c49bb5de4c-0002d2b6 .
sp:335fc1b3-63ca-474d-9c21-6d5abbdb0485-00033925 bot:adjacentElement el:2da40d62-4698-436c-a2c3-95c49bb5de4c-0002d2e8 .
sp:335fc1b3-63ca-474d-9c21-6d5abbdb0485-00033925 bot:adjacentElement el:2da40d62-4698-436c-a2c3-95c49bb5de4c-0002d30d .
sp:335fc1b3-63ca-474d-9c21-6d5abbdb0485-00033925 bot:adjacentElement el:64b7f7d3-8cfc-4277-ba33-8de2e6502424-00031a53 .
sp:335fc1b3-63ca-474d-9c21-6d5abbdb0485-00033925 bot:adjacentElement el:64b7f7d3-8cfc-4277-ba33-8de2e6502424-00031cde .
sp:335fc1b3-63ca-474d-9c21-6d5abbdb0485-00033925 bot:adjacentElement el:e21226ef-c42d-4907-9a6f-46644e16769a-00035146 .
sp:335fc1b3-63ca-474d-9c21-6d5abbdb0485-00033925 bot:adjacentElement el:e21226ef-c42d-4907-9a6f-46644e16769a-00035147 .
sp:335fc1b3-63ca-474d-9c21-6d5abbdb0485-00033925 bot:adjacentElement el:e21226ef-c42d-4907-9a6f-46644e16769a-00035148 .
sp:335fc1b3-63ca-474d-9c21-6d5abbdb0485-00033925 bot:adjacentElement el:e21226ef-c42d-4907-9a6f-46644e16769a-00035149 .
sp:335fc1b3-63ca-474d-9c21-6d5abbdb0485-00033925 bot:adjacentElement el:e21226ef-c42d-4907-9a6f-46644e16769a-000351e9 .
sp:335fc1b3-63ca-474d-9c21-6d5abbdb0485-00033925 bot:adjacentElement el:e21226ef-c42d-4907-9a6f-46644e16769a-000351ea .
sp:335fc1b3-63ca-474d-9c21-6d5abbdb0485-00033925 bot:adjacentElement el:e21226ef-c42d-4907-9a6f-46644e16769a-000351eb .
sp:335fc1b3-63ca-474d-9c21-6d5abbdb0485-00033925 bot:adjacentElement el:e21226ef-c42d-4907-9a6f-46644e16769a-000351ec .`;

    public wallClassTriples =
`@prefix ont: <http://localhost:3000/duplex/arch/ontology#> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix bot: <https://w3id.org/bot#> .

ont:ExteriorBrickOnBlock a owl:Class ;
	rdfs:subClassOf bot:Element .
ont:InteriorPartition92MmStud a owl:Class ;
	rdfs:subClassOf bot:Element .
ont:PartyWallCmuResidentialUnitDimisingWall a owl:Class ;
	rdfs:subClassOf bot:Element .
ont:FoundationConcrete417Mm a owl:Class ;
	rdfs:subClassOf bot:Element .
ont:FoundationConcrete435Mm a owl:Class ;
	rdfs:subClassOf bot:Element .
ont:InteriorPlumbing152MmStud a owl:Class ;
	rdfs:subClassOf bot:Element .
ont:InteriorFurring152MmStud a owl:Class ;
	rdfs:subClassOf bot:Element .
ont:InteriorFurring38MmStud a owl:Class ;
	rdfs:subClassOf bot:Element .`;

    public wallClassAssTriples = 
`@prefix el: <http://localhost:3000/duplex/arch/walls/> .
@prefix ont: <http://localhost:3000/duplex/arch/ontology#> .

el:961b67a3-2b6f-48ab-ad23-45e0e6490906-0001ff4c a ont:ExteriorBrickOnBlock .
el:961b67a3-2b6f-48ab-ad23-45e0e6490906-0001ff4c a ont:ExteriorBrickOnBlock .
el:961b67a3-2b6f-48ab-ad23-45e0e6490906-0001ff4c a ont:ExteriorBrickOnBlock .
el:961b67a3-2b6f-48ab-ad23-45e0e6490906-0001ff4c a ont:ExteriorBrickOnBlock .
el:054d80e5-29bc-45f6-97c0-69c66c3c40de-0001f568 a ont:InteriorPartition92MmStud .
el:054d80e5-29bc-45f6-97c0-69c66c3c40de-0001f568 a ont:InteriorPartition92MmStud .
el:8e2bc680-004c-488c-9dec-200d8ec2ceae-0001f62b a ont:PartyWallCmuResidentialUnitDimisingWall .
el:8e2bc680-004c-488c-9dec-200d8ec2ceae-0001f62b a ont:PartyWallCmuResidentialUnitDimisingWall .
el:8e2bc680-004c-488c-9dec-200d8ec2ceae-0001f62b a ont:PartyWallCmuResidentialUnitDimisingWall .
el:054d80e5-29bc-45f6-97c0-69c66c3c40de-0001f568 a ont:InteriorPartition92MmStud .
el:054d80e5-29bc-45f6-97c0-69c66c3c40de-0001f568 a ont:InteriorPartition92MmStud .
el:054d80e5-29bc-45f6-97c0-69c66c3c40de-0001f568 a ont:InteriorPartition92MmStud .
el:71d46e38-ef86-466d-9add-4492c7183a3e-0001f6a4 a ont:FoundationConcrete417Mm .
el:71d46e38-ef86-466d-9add-4492c7183a3e-0001f6a4 a ont:FoundationConcrete417Mm .
el:71d46e38-ef86-466d-9add-4492c7183a3e-0001f6a4 a ont:FoundationConcrete417Mm .
el:71d46e38-ef86-466d-9add-4492c7183a3e-0001f6a4 a ont:FoundationConcrete417Mm .
el:98d604b7-4c6f-4ae8-b5f3-0187bb50c215-0003292a a ont:FoundationConcrete435Mm .
el:98d604b7-4c6f-4ae8-b5f3-0187bb50c215-0003292a a ont:FoundationConcrete435Mm .
el:98d604b7-4c6f-4ae8-b5f3-0187bb50c215-0003292a a ont:FoundationConcrete435Mm .
el:8e2bc680-004c-488c-9dec-200d8ec2ceae-0001f62b a ont:PartyWallCmuResidentialUnitDimisingWall .
el:961b67a3-2b6f-48ab-ad23-45e0e6490906-0001ff4c a ont:ExteriorBrickOnBlock .
el:961b67a3-2b6f-48ab-ad23-45e0e6490906-0001ff4c a ont:ExteriorBrickOnBlock .
el:961b67a3-2b6f-48ab-ad23-45e0e6490906-0001ff4c a ont:ExteriorBrickOnBlock .
el:961b67a3-2b6f-48ab-ad23-45e0e6490906-0001ff4c a ont:ExteriorBrickOnBlock .
el:054d80e5-29bc-45f6-97c0-69c66c3c40de-0001f568 a ont:InteriorPartition92MmStud .
el:054d80e5-29bc-45f6-97c0-69c66c3c40de-0001f568 a ont:InteriorPartition92MmStud .
el:054d80e5-29bc-45f6-97c0-69c66c3c40de-0001f568 a ont:InteriorPartition92MmStud .
el:054d80e5-29bc-45f6-97c0-69c66c3c40de-0001f57e a ont:InteriorPlumbing152MmStud .
el:054d80e5-29bc-45f6-97c0-69c66c3c40de-0001f568 a ont:InteriorPartition92MmStud .
el:054d80e5-29bc-45f6-97c0-69c66c3c40de-0001f568 a ont:InteriorPartition92MmStud .
el:054d80e5-29bc-45f6-97c0-69c66c3c40de-0001f568 a ont:InteriorPartition92MmStud .
el:054d80e5-29bc-45f6-97c0-69c66c3c40de-0001f568 a ont:InteriorPartition92MmStud .
el:054d80e5-29bc-45f6-97c0-69c66c3c40de-0001f568 a ont:InteriorPartition92MmStud .
el:054d80e5-29bc-45f6-97c0-69c66c3c40de-0001f57e a ont:InteriorPlumbing152MmStud .
el:961b67a3-2b6f-48ab-ad23-45e0e6490906-0001ff4c a ont:ExteriorBrickOnBlock .
el:961b67a3-2b6f-48ab-ad23-45e0e6490906-0001ff4c a ont:ExteriorBrickOnBlock .
el:961b67a3-2b6f-48ab-ad23-45e0e6490906-0001ff4c a ont:ExteriorBrickOnBlock .
el:961b67a3-2b6f-48ab-ad23-45e0e6490906-0001ff4c a ont:ExteriorBrickOnBlock .
el:2c391822-07f8-4a22-86a8-a1e574103a53-0002dd93 a ont:InteriorFurring152MmStud .
el:2c391822-07f8-4a22-86a8-a1e574103a53-0002dd93 a ont:InteriorFurring152MmStud .
el:054d80e5-29bc-45f6-97c0-69c66c3c40de-0001f568 a ont:InteriorPartition92MmStud .
el:2c391822-07f8-4a22-86a8-a1e574103a53-0002dd93 a ont:InteriorFurring152MmStud .
el:2c391822-07f8-4a22-86a8-a1e574103a53-0002dd93 a ont:InteriorFurring152MmStud .
el:2c391822-07f8-4a22-86a8-a1e574103a53-0002dd93 a ont:InteriorFurring152MmStud .
el:2c391822-07f8-4a22-86a8-a1e574103a53-0002dd93 a ont:InteriorFurring152MmStud .
el:054d80e5-29bc-45f6-97c0-69c66c3c40de-0001f568 a ont:InteriorPartition92MmStud .
el:054d80e5-29bc-45f6-97c0-69c66c3c40de-0001f568 a ont:InteriorPartition92MmStud .
el:054d80e5-29bc-45f6-97c0-69c66c3c40de-0001f568 a ont:InteriorPartition92MmStud .
el:054d80e5-29bc-45f6-97c0-69c66c3c40de-0001f568 a ont:InteriorPartition92MmStud .
el:054d80e5-29bc-45f6-97c0-69c66c3c40de-0001f594 a ont:InteriorFurring38MmStud .
el:054d80e5-29bc-45f6-97c0-69c66c3c40de-0001f594 a ont:InteriorFurring38MmStud .
el:054d80e5-29bc-45f6-97c0-69c66c3c40de-0001f594 a ont:InteriorFurring38MmStud .
el:054d80e5-29bc-45f6-97c0-69c66c3c40de-0001f594 a ont:InteriorFurring38MmStud .
el:054d80e5-29bc-45f6-97c0-69c66c3c40de-0001f594 a ont:InteriorFurring38MmStud .
el:054d80e5-29bc-45f6-97c0-69c66c3c40de-0001f594 a ont:InteriorFurring38MmStud .
el:054d80e5-29bc-45f6-97c0-69c66c3c40de-0001f594 a ont:InteriorFurring38MmStud .
el:054d80e5-29bc-45f6-97c0-69c66c3c40de-0001f594 a ont:InteriorFurring38MmStud .`;

    public thermalEnvironmentTriples =
`@prefix ont: <http://localhost:3000/duplex/ice/ontology#> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix ice: <https://w3id.org/ice#> .

ont:OutdoorsAir a owl:Class ;
    rdfs:subClassOf ice:ThermalEnvironment ;
    rdfs:label "Outdoors Air"@en .
ont:OutdoorsGround a owl:Class ;
    rdfs:subClassOf ice:ThermalEnvironment ;
    rdfs:label "Outdoors Ground"@en .
ont:HeatedRoom a owl:Class ;
    rdfs:subClassOf ice:ThermalEnvironment ;
    rdfs:label "Heated Room"@en .
ont:UnheatedRoom a owl:Class ;
    rdfs:subClassOf ice:ThermalEnvironment ;
    rdfs:label "Unheated Room"@en .`;

    public outdoorEnvironmentTriples =
`@prefix ont: <http://localhost:3000/duplex/ice/ontology#> .
@prefix inst: <http://localhost:3000/duplex/ice/zones/> .

inst:theOutside a ont:OutdoorsAir .`;

    public thermalEnvironmentPropertyTriples =
`@prefix ont: <http://localhost:3000/duplex/ice/ontology#> .
@prefix props: <https://w3id.org/props#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

ont:OutdoorsAir props:designAmbientTemperature "-12"^^xsd:decimal .
ont:OutdoorsGround props:designAmbientTemperature "10"^^xsd:decimal .
ont:HeatedRoom props:designAmbientTemperature "20"^^xsd:decimal ;
    props:airFlowrateInfiltration "0.13"^^xsd:decimal .
ont:UnheatedRoom props:designAmbientTemperature "15"^^xsd:decimal .
`

    public dymmyElementTriples =
`@prefix ont: <http://localhost:3000/duplex/ice/ontology#> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix ice: <https://w3id.org/ice#> .
@prefix bot: <https://w3id.org/bot#> .

ont:DummyElement a owl:Class ;
    rdfs:subClassOf bot:Element ;
    rdfs:label "Dummy Element"@en .`;

    public dymmyElementPropertyTriples =
`@prefix ont: <http://localhost:3000/duplex/ice/ontology#> .
@prefix props: <https://w3id.org/props#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

ont:DummyElement props:thermalTransmittance "0.2"^^xsd:decimal .`;

    public createInterfacesQuery =
`PREFIX bot: <https://w3id.org/bot#>
PREFIX ice: <https://w3id.org/ice#>
PREFIX ont: <http://localhost:3000/duplex/ice/ontology#>
PREFIX props: <https://w3id.org/props#>
PREFIX opm: <https://w3id.org/opm#>
PREFIX schema: <http://schema.org/>
PREFIX prov: <http://www.w3.org/ns/prov#>

CONSTRUCT{
    # Create interface
    ?interfaceURI a bot:Interface , ice:ThermalEnvelope ;
        ice:surfaceInterior ?sp ;
        ice:surfaceExterior ?ext ;
        ice:representsElement ?el .
    
    # Assign random area to the interface
    ?interfaceURI props:heatTransferSurfaceArea ?propURI .
    ?propURI opm:hasPropertyState ?stateURI .
  	?stateURI a opm:InitialPropertyState , opm:CurrentPropertyState , opm:Assumed ;
    	schema:value ?area ;
    	prov:generatedAtTime ?now .
}
WHERE{
    # GET EXTERIOR ZONE
    ?ext a ont:OutdoorsAir .

    # GET SPACE AND ADJACENT ELEMENT
    ?sp a bot:Space ;
        bot:adjacentElement ?el .

    # There cannot be an interface between the space and the element already
    MINUS{
        ?x ice:surfaceInterior ?sp ;
            ice:representsElement ?el
    }

    # GENERATE RANDOM NUMBER BETWEEN 0-10 AND ASSIGN IT TO VARIABLE ?area
    BIND(round(rand()*10) AS ?area)

    # GET CURRENT TIME STAMP AND ASSIGN IT TO VARIABLE ?now
    BIND(now() AS ?now)

    # STRIP THE URI OF THE SPACE TO GENERATE URIs FOR NEW RESOURCES AS {host}/{guid}
    BIND(IRI(CONCAT(REPLACE(STR(?sp), "(?!([^/]*/){3}).*", "ice/interfaces/"), STRUUID())) AS ?interfaceURI)
    BIND(IRI(CONCAT(REPLACE(STR(?sp), "(?!([^/]*/){3}).*", "ice/states/"), STRUUID())) AS ?stateURI)
    BIND(IRI(CONCAT(REPLACE(STR(?sp), "(?!([^/]*/){4}).*", "ice/properties/"), STRUUID())) AS ?propURI)
}`;

    public getSpaceEnvelopeQuery =
`PREFIX bot: <https://w3id.org/bot#>
PREFIX ice: <https://w3id.org/ice#>
PREFIX ont: <http://localhost:3000/duplex/ice/ontology#>
PREFIX props: <https://w3id.org/props#>
PREFIX opm: <https://w3id.org/opm#>
PREFIX schema: <http://schema.org/>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

CONSTRUCT{
  ?sp a ?spClass ;
    ice:hasEnvelope ?int ;
    rdfs:label ?name .
  ?int a ?intClass ;
    props:heatTransferSurfaceArea ?area .
}
WHERE{
    ?sp a bot:Space , ?spClass ;
        rdfs:label ?name .
    ?int a ice:ThermalEnvelope , ?intClass ;
    	ice:surfaceInterior ?sp ;
    	ice:representsElement ?el ;
        props:heatTransferSurfaceArea/opm:hasPropertyState [
    		a opm:CurrentPropertyState ;
    		schema:value ?area
  		]
}`;

    public calculationData = [
        {
            label: '"Temperature difference over thermal envelope segments"@en',
            argumentPaths: [
                '?foi ice:surfaceExterior ?ext . ?ext a ?env1 . ?env1 rdfs:subClassOf+ ?restr1 . ?restr1 a owl:Restriction ; owl:onProperty props:designAmbientTemperature ; owl:hasValue ?te', 
                '?foi ice:surfaceInterior ?int . ?int a ?env2 . ?env2 rdfs:subClassOf+ ?restr2 . ?restr2 a owl:Restriction ; owl:onProperty props:designAmbientTemperature ; owl:hasValue ?ti'],
            comment: 'Temperature difference over surface at design conditions for heating.',
            userURI: 'https://www.niras.dk/employees/mhra',
            expression: "?ti-?te",
            inferredProperty: 'props:designTemperatureDifference'
        },
        {
            label: '"UA value for thermal envelope segments"@en',
            argumentPaths: [
                '?foi ice:representsElement ?el . ?el a ?elType . ?elType rdfs:subClassOf+ ?restr . ?restr a owl:Restriction ; owl:onProperty props:thermalTransmittance ; owl:hasValue ?uVal', 
                '?foi props:heatTransferSurfaceArea ?area'],
            comment: 'Multiplies the adjacent element´s U-value with the area of the surface',
            userURI: 'https://www.niras.dk/employees/mhra',
            expression: "?uVal*?area",
            inferredProperty: 'props:nominalUA'
        },{
            label: '"Heat transmission loss over thermal envelope segments"@en',
            argumentPaths: [
                '?el props:nominalUA ?ua', 
                '?el props:designTemperatureDifference ?dt'],
            comment: 'UA*dT',
            userURI: 'https://www.niras.dk/employees/mhra',
            expression: "?ua*?dt",
            inferredProperty: 'props:totalHeatTransferRate'
        },{
            label: '"Infiltration heat loss"@en',
            argumentPaths: [
                '?sp props:area ?a',
                '?sp a ?env . ?env rdfs:subClassOf+ ?restr1 . ?restr1 a owl:Restriction ; owl:onProperty props:designAmbientTemperature ; owl:hasValue ?ti', 
                '?sp a ?env . ?env rdfs:subClassOf+ ?restr2 . ?restr2 a owl:Restriction ; owl:onProperty props:airFlowrateInfiltration ; owl:hasValue ?inf'],
            comment: 'Calculates infiltration heat loss as the product of spaceArea*infiltrationRatePerSqm*1.166*1.0075*(roomTemperature-(-12))',
            userURI: 'https://www.niras.dk/employees/mhra',
            expression: "?a*?inf*1.166*1.0075*(?ti-(-12))",
            inferredProperty: 'props:infiltrationHeatTransferRate'
        },{
            label: '"Transmission heat loss for space"@en',
            argumentPaths: ['?foi a ice:ThermalEnvironment ; ^ice:surfaceInterior ?i . ?i props:totalHeatTransferRate ?htr'],
            type: "sum",
            comment: 'Sums the transmission heat loss through all the parts of the building envelope which face the space.',
            userURI: 'https://www.niras.dk/employees/mhra',
            expression: "?htr",
            inferredProperty: 'props:transmissionHeatTransferRate'
        },{
            label: '"Total heat loss for space"@en',
            argumentPaths: [
                '?foi props:transmissionHeatTransferRate ?tr', 
                '?foi props:infiltrationHeatTransferRate ?inf'],
            comment: 'Returns the sum of the infiltration heat loss and the transmission heat loss for each space.',
            userURI: 'https://www.niras.dk/employees/mhra',
            expression: "?tr+?inf",
            inferredProperty: 'props:heatingDemand'
        }
    ]

}