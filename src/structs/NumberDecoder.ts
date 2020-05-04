import { Data } from "../classes/Data";
import { Decoder } from "../classes/Decoder";
import { STError } from "../classes/STError";

class NumberDecoder implements Decoder<number> {
    decode(data: Data): number {
        if (typeof data.value == "number" && !Number.isNaN(data.value) && Number.isFinite(data.value)) {
            return data.value;
        }

        throw new STError({
            code: "invalid_field",
            message: `Expected a number at ${data.currentField}`,
            field: data.currentField
        });
    }
}

// We export an instance to prevent creating a new instance every time we need to decode a number
export default new NumberDecoder();
