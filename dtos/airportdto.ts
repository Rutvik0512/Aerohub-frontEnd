export class AirportDto {
    public readonly key: string;
    public readonly icao: string;
    public readonly iata: string;
    public readonly name: string;
    public readonly city: string;
    public readonly state: string;
    public readonly country: string;
    public readonly elevation: number;
    public readonly lat: number;
    public readonly lon: number;
    public readonly timezone: string;
    public readonly region: string;

    constructor({icao, iata = null, name, city = null, state = null, country, elevation, lat, lon, timezone}) {

        this.icao      = icao;
        this.key       = icao;
        this.iata      = iata  ?? '';
        this.name      = name;
        this.city      = city  ?? '';
        this.state     = state ?? '';
        this.country   = country;
        this.elevation = elevation;
        this.lat       = lat;
        this.lon       = lon;
        this.timezone  = timezone;
        this.region = country && state ? `${country}-${state}` : country || state || ""
    }
}