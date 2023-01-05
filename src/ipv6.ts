export default class Prefix {
    networkPortion: string = "";
    subnetkPortion: string = "";
    interfaceIDPortion: string = "";
    newPrefixLength: number = 0;
    prefixID: string = "";
    firstUsableAddress: string = "";
    lastUsableAddress: string = "";
    subnetNumber: number = 0;

    constructor (){
        this.networkPortion;
        this.subnetkPortion;
        this.interfaceIDPortion;
        this.newPrefixLength;
        this.prefixID;
        this.firstUsableAddress;
        this.lastUsableAddress;
        this.subnetNumber;
    }
    

    static checkFormat (ipv6Address: string, prefixLength: number): boolean {
        /**
         * This method will check user input of ipv6 address.
         * This method has an ordered sequence of checkings.
         */


        const validIPv6Char: string[] = [
            "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c",
            "d", "e", "f", ":"
        ]
        let colonCount = 0; // Colon counter.
        let doubleColonCount = 0; // Double colon counter.
        let segmentCount = 0; // Segment counter.

        // First, check each character.
        for (const char of ipv6Address) {
            if (!validIPv6Char.includes(char)) {
                console.log("Invalid character is entered!");
                return false;
            }
        }

        // A single colon cannot be at the beginning nor at the end of an ipv6 address.
        if (ipv6Address[0] === ":" || (ipv6Address[ipv6Address.length - 1] === ":" && ipv6Address.slice(-2) !== "::")) { 
            console.log("A single colon cannot be at the beginning nor at the end.");
            return false;
        }

        // Ipv6 address cannot have more than two contiguous colons.
        for (const char of ipv6Address) {
            if (char === ":") {
                colonCount++;
                if (colonCount > 2) {
                    console.log("There should only be two consecutive colons.");
                    return false;
                }            
            } else {
                colonCount = 0;
            }
        }

        // There should only be one double colon in an ipv6 address.        
        for (const char of ipv6Address) {
            if (char === ":") {
                colonCount++;
                if (colonCount === 2) {
                    doubleColonCount++;
                    if (doubleColonCount >= 2) {
                        console.log("There should only be one double colon in an ipv6 address.");
                        return false;
                    }
                }
            } else {
                colonCount = 0;
            }
        }

        // A valid ipv6 address should only have a max of four hex digits in each segment.
        for (const segment of ipv6Address.split(":")) {
            if (segment.length > 4) {
                console.log("Each segment should only have a max of four hex digits");
                return false;
            }
        }

        // If double colon doesn't exist then a valid ipv6 address has an eight groups of segment and should only have a max of 7 colons.
        if (!ipv6Address.includes("::")) {            
            for (const char of ipv6Address) {
                if (char === ":") {
                    colonCount++;
                }
            }
            if (colonCount !== 7) {
                console.log("Incorrect number of segments is entered!");
                return false;
            }
        }        
        // Double colon can only be used if there's two or more consecutive of segments of all zeros.                    
        else if (ipv6Address.includes("::")) {
            for (const segment of ipv6Address.split(":")) {
                if (segment.length !== 0) {
                    segmentCount++;
                }
            }

            if (segmentCount > 6) {
                console.log(":: can only be used if there's two or more consecutive of segments of all zeros");
                return false;
            }
        }

        // Check for prefix length.
        if (prefixLength <= 0 || prefixLength >= 128) {
            console.log("Invalid Prefix Length!");
            return false;
        }

        // Finally return true if it passed all checkings.
        console.log("Valid!");
        return true;        
    }


    static expand (ipv6Address: string): string {
        /**
         * This method will expand ipv6 address if it's abbreviated 
         * by adding leading zeros and turning :: into segments of all zeros.         
         */
        
        let ipv6Array: Array<string> = [];

        // First, Check if it needs to add leading zeros.   
        for (const segment of ipv6Address.split(":")) {            
            if (segment.length !== 4 && segment.length !== 0) {
                const zerosToPrepend = 4 - segment.length; 
                ipv6Array.push("0".repeat(zerosToPrepend) + segment);    
            }
            // If a segment has four hex digits just add it.
            else if(segment.length === 4) {
                ipv6Array.push(segment);                
            }            
        }

        // Check if double colon(::) exists at the end.     
        if (ipv6Address.slice(-2) === "::") {        
            // Append segments of all zeros.
            // Append zeros of four until there are eight sets of segments to complete the address.
            while(ipv6Array.length !== 8) {
                ipv6Array.push("0000");                                
            }                               
        }   

        // If double colon(::) exists somewhere not at the end.
        // Insert segments of all zeros until there are eight sets of segments to complete the address.
        else if (ipv6Address.includes("::")) {
            // Turn ipv6 address to an array and find the index of an empty string.
            const toInsertAt = ipv6Address.split(":").indexOf("");
            // Keep adding until there's a total of 8 segments.
            while(ipv6Array.length !== 8) {
                ipv6Array.splice(toInsertAt, 0, "0000");
            }
        }        
        
        // Finally return it as a string.        
        return ipv6Array.join(":");
    }


    static abbreviate (ipv6Address: string): string {
        /**
         * This method will abbreviate ipv6 address by removing leading zeros and          
         * substitute double colons(::) into two or more consecutive segments of all zeros.         
         * This method assumes that the ipv6 address input is in an expanded form.         
         */
        

        // Make sure that the input is in unabbreviated form.
        // Turn ipv6 address input into an array of string. 
        let ipv6Array: Array<string> = this.expand(ipv6Address).split(":");                
            
        // First, omit leading zeros.
        ipv6Array = ipv6Array.map(elem => {
            let hexZeroCount = 0; // Hex zero counter.
            let newSegment = '';
            
            for (const char of elem) {          
                // Get the first non-zero hex digit it detects and the rest of the digts in a segment.   
                if (char !== "0") {                    
                    const indexOfNonZeroHex = elem.indexOf(char);
                    newSegment = elem.slice(indexOfNonZeroHex);
                    break;
                }
                else {
                    // If char is zero increment the counter by 1.
                    hexZeroCount++;
                }

                // If a segment has all zeros it leaves a single 0.
                if (hexZeroCount === 4) {
                    newSegment = "0";
                }
            }
            return newSegment;
        })

        // Second, Substitute double colons(::) into multiple consecutive segments of all zeros.
        // Check first if there's two instaces of segments of all zeros in a row.
        let instances: Array<number> = [];
        let segmentsOfZerosCount = 0; // Segment of zeros counter.
        let currentIndex = 0; // used to keep track the current index in a loop.

        ipv6Array.forEach(elem => {
            
            if (elem === "0") {
                segmentsOfZerosCount++;
            }
            else {
                segmentsOfZerosCount = 0;
            }
            
            // Add instaces of string of segments of all zeros.
            if (segmentsOfZerosCount === 2) {
                const indexOfAnInstance = currentIndex - 1;
                instances.push(indexOfAnInstance)
            }            
            currentIndex++;
        })

        // Then if there's two instances then we should pick the longest sequence.
        if (instances.length === 2) {
            const firstInstanceIndex = instances[0];
            const secondInstanceIndex = instances[1];
            let firstInstanceLength = 0; // Length means number of segments of all zeros.
            let secondInstanceLength = 0; // Length means number of segments of all zeros.

            // Get the length of the first instance.
            for (const elem of ipv6Array.slice(firstInstanceIndex, secondInstanceIndex)) {
                // If elem not equal to zero means end of a string of segments of all zeros                  
                // because the sliced array could contain segment of zeros after a non-zeros of segment.
                if (elem !== "0") {
                    break;
                }
                else{
                    // Otherwise keep incrementing.
                    firstInstanceLength++;
                }
            }
            // Get the length of the second instance.
            for (const elem of ipv6Array.slice(secondInstanceIndex)) {
                // If elem not equal to zero means end of a string of segments of all zeros                  
                // because the sliced array could contain segment of zeros after a non-zeros of segment.
                if (elem !== "0") {
                    break;
                }
                else {
                    secondInstanceLength++;
                }
            }
            console.log(ipv6Array)
            console.log("first", firstInstanceLength)
            console.log("second", secondInstanceLength)
            // Then compare the two lengths.            
            if (firstInstanceLength > secondInstanceLength) {
                // * is inserted to mark for double colon(::).
                ipv6Array.splice(firstInstanceIndex, firstInstanceLength, "*");
            }
            else if(secondInstanceLength > firstInstanceLength) {
                // * is inserted to mark for double colon(::).
                ipv6Array.splice(secondInstanceIndex, secondInstanceLength, "*");
            }
            else {
                // Otherwise the two lengths are equal, pick the second instance.
                // * is inserted to mark for double colon(::).
                ipv6Array.splice(secondInstanceIndex, secondInstanceLength, "*");
            }
        }
        // If there's only one instace.
        else if(instances.length === 1){            
            const instanceIndex = instances[0];
            let instanceLength = 0; // Length means number of segments of all zeros.
            for (const elem of ipv6Array.slice(instanceIndex)) {
                // If elem not equal to zero means end of a string of segments of all zeros                  
                // because the sliced array could contain segment of zeros after a non-zeros of segment.
                if (elem !== "0") {
                    break
                }
                else {
                    instanceLength++;
                }                
            }
            // * is inserted to mark for double colon(::). 
            ipv6Array.splice(instanceIndex, instanceLength, "*");
        }
        console.log(ipv6Array)
        // Write the ipv6 address in a colon notation.
        let ipv6 = "";
        for (let index = 0; index < ipv6Array.length; index++) {
            const element = ipv6Array[index];

            if (element === "*") {
                ipv6 += ":"
                continue
            }

            ipv6 += element;
            
            // Do not add colon to the end of an array if the last
            // element is not part of the series of segments of 0s.
            if (index !== (ipv6Array.length - 1)) {
                ipv6 += ":";    
            }                       
        }
        console.log(ipv6);
        // Finally return ipv6 as string.
        return ipv6;
    }


    static hexToBin (hex: string): string {
        /**
         * This method will convert hexadecimal(s) to binaries.
         * This method will use four bits to output each hex.
        */        

        let binaries: string = "";

        // Because numbers greater than (2 ** 53 - 1) loses precision 
        // we have to convert individual hex from input if multiple hex 
        // are given rather than the whole hexadecimals in one go.        

        for (const char of hex) {            
            // First, convert hex to number.
            const dec = parseInt(char, 16);
            
            // then from number to binaries.
            const bin = dec.toString(2);

            // Because toString method does not add leading zeros
            // we have to prepend leading zeros.
            const zerosToPrepend = 4 - bin.length;
            binaries += "0".repeat(zerosToPrepend) + bin;            
        }        
        
        // Finally return binaries.
        return binaries;
    }


    static binToHex (bin: string): string {
        /**
         * This method will convert binaries to hexadecimal(s).
         * This method accepts a minimun of a 4-bit binaries.
         */

        let hex: string = "";

        // First, convert binaries to number(decimal). 
        const dec = parseInt(bin, 2)

        // Because numbers greater than (2 ** 53 - 1) lose precision.
        // We should have different ways of solving it.
        const isNumberSafe = Number.isSafeInteger(dec);

        if (isNumberSafe) {
            // If the input binaries convert to safe numbers, then convert them
            // to hexadecimal(s) directly.
            hex = dec.toString(16);
            return hex;
        }
        else {
            // Otherwise not safe, means there are more than 52 bits of binaries.
            // The safest max number of bits we can convert is 52 bits(13 hexadecimals).
            // Safe binary digits is less than or equal to 52.

            // Convert it to array.
            const binArray = bin.split("");
            const maxSafeBitsCount = Math.floor(bin.length / 52); // Number of 52 bits.
            const hexArray: Array<string> = [] 
            
            // Slice 52 bits from binArray maxSafeBitsCount times
            // from right to left.
            for (let index = 0; index < maxSafeBitsCount; index++) {
                // Start index to slice.
                const startIndex = binArray.length - 52;
                // Up to last element after the start index.
                const deleteRemainingElems = binArray.length;
                // Remove 52 bits from binArray.
                const maxSafeBits = binArray.splice(startIndex, deleteRemainingElems);
                // Turn removed bits into string then to number.
                const num = parseInt(maxSafeBits.join(""), 2);
                // then to hexadecimals as string.
                // Because putting a series of 0s to toString method leaves you
                // a single 0 we have to give it 13 0s for 52 bits of 0s.
                const hex = num === 0 ? "0000000000000" : num.toString(16);
                hexArray.unshift(hex);
                console.log(startIndex)
            }

            // Then add the remaining elements(binaries) in binArray as hexadecimals 
            // to hexArray if there are any left.
            if (binArray.length > 0) hexArray.unshift(parseInt(binArray.join(""), 2).toString(16));
            // console.log(hexArray)

            // Then join them in one singe string and return it.
            return hexArray.join("");
        }           
    }

    
    static ipv6ToBin (ipv6Address: string): string[] {
        /**
         * This method will convert ipv6 address into contiguous binaries.
         * This method assumes that the address input is unabbreviated.
         * This method returns an array of binaries so that it leaves you a choice
         * to turn it into a colon notation or leaves it as a contiguous binaries.
         */

        // Make sure that the address input is unabbreviated.
        // Turn the address input into an array of segments.
        let ipv6Array: Array<string> = this.expand(ipv6Address).split(":");
        let segmentsArray: Array<string> = [];

        // Turn each segments of hex(s) into segments of binaries and set them to segmentsArray.
        segmentsArray = ipv6Array.map(elem => {
            return this.hexToBin(elem);
        })

        // Finally return an array of binaries.
        return segmentsArray;
    }


    static getPrefix (ipv6Address: string, prefixLength: number, subnetBits: number, prefixToFind: number) {
        /**
         * This method will list prefix(subnet) based on the value of prefixToFind.
         * This method assumes that the address input is unabbreviated.
         */

        const ipv6Bin: string = this.ipv6ToBin(ipv6Address).join(); // Contiguous binaries.
        const interfaceIDBits = 128 - (prefixLength + subnetBits);
        const networkPortionBits = 128 - (subnetBits + interfaceIDBits);
        const newPrefixLength = prefixLength + subnetBits;
        
    }
}

