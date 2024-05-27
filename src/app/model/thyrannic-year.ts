export class ThyrannicYear {
    
    private epoch: number;
    private year: number;
    
    static fromSeq(seq: number): ThyrannicYear {
        const epoch = (seq - 1) / 200 + 1;
        const year = (seq - 1) % 200 + 1;
        return new ThyrannicYear(epoch, year);
    }
    
    constructor(epoch: number, year: number) {
        this.epoch = epoch;
        this.year = year;
    }
    
    public getSeq(): number {
        return 200 * (this.epoch - 1) + this.year;
    }
    
    public toString(): string {
        return "" + this.epoch + "," + this.year;
    }
    
}