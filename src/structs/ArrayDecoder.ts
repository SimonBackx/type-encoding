import { Data } from "../classes/Data";
import { Decoder } from "../classes/Decoder";
import { DecodingError } from "../classes/DecodingError";
import { ObjectData } from "../classes/ObjectData";

export class ArrayDecoder<T> implements Decoder<T[]> {
    decoder: Decoder<T>;

    constructor(decoder: Decoder<T>) {
        this.decoder = decoder;
    }

    decode(data: Data): T[] {
        if (Array.isArray(data.value)) {
            return data.value.map((v, index) => new ObjectData(v, data.addToCurrentField(index), data.version)).map((d) => d.decode(this.decoder));
        }

        throw new DecodingError({
            code: "invalid_field",
            message: `Expected an array at ${data.currentField}`,
            field: data.currentField,
        });
    }
}
