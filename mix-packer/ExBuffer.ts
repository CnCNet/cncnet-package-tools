class FileItemArray {
    Array: Array<{ buffer: Buffer; offset: number }> = [];

    add(buffer: Buffer, offset: number): void {
        this.Array.push({ buffer, offset });
    }

    find(source: Buffer): number {
        const result = this.Array.find((i) => {
            return i.buffer.equals(source);
        });
        return result ? result.offset : -1;
    }
}

export default class ExBuffer {
    fileItems = new FileItemArray();
    buffer: Buffer;
    offset: number;

    constructor(size: number) {
        this.offset = 0;
        this.buffer = Buffer.allocUnsafe(size * 2);
    }

    GetBuffer(): Buffer {
        return this.buffer.subarray(0, this.offset);
    }

    private ensureCapacity(size: number): void {
        if (size <= this.buffer.length) {
            return;
        }

        const buffer = Buffer.allocUnsafe(Math.max(size, this.buffer.length * 2));
        this.buffer.copy(buffer, 0, 0, this.offset);
        this.buffer = buffer;
    }

    findOrCopy(source: Buffer) {
        let result = this.fileItems.find(source);
        if (result === -1) {
            result = this.copy(source);
        }
        return result;
    }

    copy(source: Buffer) {
        const result = this.offset;
        this.ensureCapacity(result + source.length);
        source.copy(this.buffer, result);
        this.offset += source.length;
        this.fileItems.add(this.buffer.subarray(result, this.offset), result);

        return result;
    }

    write(value: number) {
        this.ensureCapacity(this.offset + 4);
        this.buffer.writeUInt32LE(value, this.offset);
        this.offset += 4;
    }
}
