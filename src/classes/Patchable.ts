import { Encodeable } from "./Encodeable";
import { PatchableArray } from "../structs/PatchableArray";
import { AutoEncoder } from "./AutoEncoder";
import { Identifiable, IdentifiableType, NonScalarIdentifiable, BaseIdentifiable } from "./Identifiable";

export interface StrictPatch {}
export interface Patchable<T> {
    patch(patch: PatchType<T>): T;
}

export function isPatchable<T>(object: T): object is T & Patchable<any> {
    return !!(object as any).patch;
}

export function patchContainsChanges<B extends Encodeable & Patchable<B>, A extends PatchType<B>>(patch: A, model: B): boolean {
    const patched = model.patch(patch);
    return JSON.stringify(patched.encode()) != JSON.stringify(model.encode());
}

type ConvertArrayToPatchableArray<T> = T extends Array<infer P>
    ? P extends string
        ? PatchableArray<string, string, string>
        : P extends number
        ? PatchableArray<number, number, number>
        : P extends AutoEncoder & Identifiable
        ? PatchableArray<IdentifiableType<P>, P, PatchType<P> & AutoEncoder & NonScalarIdentifiable>
        : T | undefined
    : PatchType<T>;

type RemoveMethodsHelper<Base> = {
    [Key in keyof Base]: Base[Key] extends Function ? never : Key;
};
type NonMethodNames<Base> = Exclude<RemoveMethodsHelper<Base>[keyof Base], undefined>;

type GetOptionalPropertiesOfHelper<Base> = {
    [Key in keyof Base]: Base[Key] extends string | number | Array<any> | Function | boolean | Object ? never : Key;
};
type GetOptionalPropertiesOf<Base> = Exclude<GetOptionalPropertiesOfHelper<Base>[keyof Base], undefined>;

type MakeOptionalRealOptionalHelper<Base> = {
    [Key in GetOptionalPropertiesOf<Base>]?: Base[Key];
} &
    {
        [Key in Exclude<keyof Base, GetOptionalPropertiesOf<Base>>]: Base[Key];
    };
type MakeOptionalRealOptional<Base> = {
    [Key in keyof MakeOptionalRealOptionalHelper<Base>]: Base[Key];
};

export type PatchType<T> = T extends object
    ? T extends PatchableArray<any, any, any>
        ? T
        : {
              [P in Exclude<NonMethodNames<T>, "id">]: ConvertArrayToPatchableArray<T[P]>;
          } &
              NonScalarIdentifiable
    : T | undefined;
