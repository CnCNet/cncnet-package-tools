import CRC32 from './CRC32';

export type NameFormat = 'rol1' | 'padded-crc32' | 'rol3' | 'ror6';

export interface NameIdAlgorithm {
    getId(name: string): number;
}

function canonicalize(name: string): Buffer {
    const result = Buffer.alloc(name.length);
    for (let i = 0; i < name.length; i++) {
        const value = name.charCodeAt(i);
        if (value === 0 || value > 0x7f) {
            throw new Error(`Invalid MIX filename character at index ${i}`);
        }
        result[i] = value >= 0x61 && value <= 0x7a ? value - 0x20 : value;
    }
    return result;
}

function rotateLeft(value: number, bits: number): number {
    return ((value << bits) | (value >>> (32 - bits))) >>> 0;
}

function rolId(name: string, bits: number): number {
    const data = canonicalize(name);
    let id = 0;
    for (let offset = 0; offset < data.length; offset += 4) {
        const block = Buffer.alloc(4);
        data.copy(block, 0, offset, offset + 4);
        const rotation = offset + 4 >= data.length && data.length % 4 !== 0 ? 1 : bits;
        id = (rotateLeft(id, rotation) + block.readUInt32LE(0)) >>> 0;
    }
    return id;
}

function ror6Id(name: string): number {
    const data = canonicalize(name);
    let id = 0;
    for (const value of data) {
        id = (rotateLeft(id, 26) + ((value - 0x30) & 0x3f)) >>> 0;
    }
    return id;
}

class RolAlgorithm implements NameIdAlgorithm {
    constructor(private readonly rotation: 1 | 3) {}

    getId(name: string): number {
        return rolId(name, this.rotation);
    }
}

class PaddedCrc32Algorithm implements NameIdAlgorithm {
    getId(name: string): number {
        const upperName = name.toUpperCase();
        const length = upperName.length;
        if (length % 4 !== 0) {
            const padding = length % 4;
            const start = length - padding;
            return CRC32(upperName + String.fromCharCode(padding) + upperName[start].repeat(3 - padding));
        }
        return CRC32(upperName);
    }
}

class Ror6Algorithm implements NameIdAlgorithm {
    getId(name: string): number {
        return ror6Id(name);
    }
}

const algorithms: Record<NameFormat, NameIdAlgorithm> = {
    rol1: new RolAlgorithm(1),
    'padded-crc32': new PaddedCrc32Algorithm(),
    rol3: new RolAlgorithm(3),
    ror6: new Ror6Algorithm(),
};

export function getNameIdAlgorithm(format: NameFormat): NameIdAlgorithm {
    return algorithms[format];
}
