export class RDFLiteral {

    token: string;
    value: string;
    lang?: string;
    type?: string;

    constructor(value?, lang?, type?){
        var v1 = value;
        this.token = "literal";
        
        if(lang){
            this.lang = lang;
        }else if(type){
            this.type = type;
        }else{
            if(typeof value === 'boolean'){
                this.type = "http://www.w3.org/2001/XMLSchema#boolean";
            } else{
                value = Number(value) ? Number(value) : value;  // Convert string formatted numbers to numbers
                if(typeof value === 'number'){
                    value = String(value); // Make sure that zero is not interpreted as false
                    this.type = "http://www.w3.org/2001/XMLSchema#decimal";
                }
                else this.type = "http://www.w3.org/2001/XMLSchema#string"; // default to string
            }
        }

        this.value = value;
    }
}