export class HotelRoomDTO {
    public id?: number;
    public hotelId?: number;
    public hotelName?: string;
    public name?: string;
    public price?: number;
    public description?: string;
    public maxAdults?: number;
    public maxChildren?: number;
    public maxBabies?: number;

    public constructor (init?: Partial<HotelRoomDTO>) {
        Object.assign(this, init);
    }
}
