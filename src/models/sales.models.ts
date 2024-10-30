export interface Sales{
     id_venta : number;
     id_usuario : number;
     fecha_venta : string;
     cantidad : number;
     peso : Record<string,any>;
     tipo : string; 
}