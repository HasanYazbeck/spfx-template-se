export class SPHelpers {

    private padWithZero(num: number): string {
        return num < 10 ? `0${num}` : `${num}`;
    }

    public convertGMTToLocalTime24Hour(gmtDate: string): string {
        // Create a Date object from the GMT date string
        const date = new Date(gmtDate); // JavaScript Date will automatically interpret the GMT date
        // Extract hours, minutes, and seconds in the local time zone
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        // Format the time as HH:mm:ss
        const formattedTime = `${this.padWithZero(hours)}:${this.padWithZero(minutes)}:${this.padWithZero(seconds)}`;
        return formattedTime;
    }
    
    public convertGMTToLocalTime12Hour(gmtDate: string): string {
        // Create a Date object from the GMT date string
        const date = new Date(gmtDate);
        // Extract hours, minutes, and seconds in the local time zone
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        // Determine AM or PM
        const ampm = hours >= 12 ? 'AM' : 'PM';
        // Convert to 12-hour format
        hours = hours % 12;
        if (hours === 0) {
            hours = 12; // Handle the case where 0 hours is 12 in 12-hour format
        }
        // Format the time as hh:mm:ss AM/PM
        const formattedTime = `${this.padWithZero(hours)}:${this.padWithZero(minutes)}:${this.padWithZero(seconds)} ${ampm}`;
    
        return formattedTime;
    }
}