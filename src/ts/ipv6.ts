interface InterfaceID {
    bits: number;
    prefix: string;
    firstUsableAddress: string;
    lastUsableAddress: string;
}

export type prefix = {
    subnetNumber: BigInt;
    networkPortion: string;
    subnetPortion: string;    
    newPrefixLength: number;
    prefix: string;
    firstUsableAddress: string;
    lastUsableAddress: string;
    interfaceIDPortion: InterfaceID;
}

export default class Prefix {
    subnetNumber: BigInt = 0n;
    networkPortion: string = "";
    subnetPortion: string = "";    
    newPrefixLength: number = 0;
    prefix: string = "";
    firstUsableAddress: string = "";
    lastUsableAddress: string = "";
    interfaceIDPortion: InterfaceID = {bits:0, prefix:"", firstUsableAddress:"", lastUsableAddress:""};

    constructor (){
        this.subnetNumber;
        this.networkPortion;
        this.subnetPortion;
        this.interfaceIDPortion;
        this.newPrefixLength;
        this.prefix;
        this.firstUsableAddress;
        this.lastUsableAddress;        
    }
    

    static ipv6Format (ipv6Address: string): boolean {
        /**
         * This method will check user input of ipv6 address and 
         * it assumes it is in lowercase.
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
        if ((ipv6Address[0] === ":" && ipv6Address.slice(0,2) !== "::") || (ipv6Address[ipv6Address.length - 1] === ":" && ipv6Address.slice(-2) !== "::")) { 
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

        // Finally return true if it passed all checkings.
        // console.log("Valid!");
        return true;        
    }


    static expand (ipv6Address: string): string | Error {
        /**
         * This method will expand ipv6 address if it's abbreviated 
         * by adding leading zeros and turning :: into segments of all zeros.
         * This method assumes that the input is in lowercase.       
         */
        
        try {
            // Check input.
            if (this.ipv6Format(ipv6Address) === false) throw new Error("Invalid IPv6 Address!");
            
            let ipv6Array: Array<string> = [];
            
            // First, Check if it needs to add leading zeros.
            // This part also will not add empty string caused by :: when split.
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
            // Check if double colon(::) exists somewhere not at the end.
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

        } catch (error: any) {
            console.log(error);
            return new Error(error.message)
        }
        
    }


    static abbreviate (ipv6Address: string): string | Error {
        /**
         * This method will abbreviate ipv6 address by removing leading zeros and          
         * substitute double colons(::) into two or more consecutive segments of all zeros.
         * This method assumes that the input is in lowercase.
        */
        
        try {
            // Check input.
            if (this.ipv6Format(ipv6Address) === false) throw new Error("Invalid IPv6 Address!");
            
            /*
             Make sure that the input is in unabbreviated form.
             Because expand() method can return either a string or an Error
             let's do type casting. So that Typescript knows what type of value
             we want to work with.
            */
            const result = this.expand(ipv6Address) as string;
            let ipv6Array: Array<string> = result.split(":");
            let segmentsOfZerosCount = 0; // Segment of zeros counter.
            let doubleColonExists = false;
            let ipv6 = ""; // To be returned.

            // First part, omit leading zeros.
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
            
            // Check for a series of segments of all 0s.
            for (const elem of ipv6Array) {
                if (elem === "0") {
                    segmentsOfZerosCount++;
                }
                else {
                    segmentsOfZerosCount = 0;
                }
                
                if (segmentsOfZerosCount === 2) {
                    doubleColonExists = true;
                    break;
                }
            }
            
            /*
             If there's no series of all 0s , then return it immediately
             to avoid the second part of this method that could cause bugs if 
             series of all 0s isn't it present.
            */
            if (!doubleColonExists) {
                // Turn the array into a colon notation, then return it.
                ipv6 = ipv6Array.join(":");
                return ipv6;
            }
            
            // Otherwise series of all 0s exists.
            // Second part, Substitute double colons(::) into multiple consecutive segments of all zeros.
            // Check first if there's two instaces of segments of all zeros in a row.
            let instances: Array<number> = [];
            segmentsOfZerosCount = 0; // Segment of zeros counter.
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
            
            // Write the ipv6 address in a colon notation.
            const doubleColonIndex = ipv6Array.indexOf("*");
            // Note that * depicts ::
            if (doubleColonIndex === 0 && ipv6Array.length === 1) {
                // If the whole address is 0s.
                ipv6Array.splice(0, 1, "::");
            }
            else if (doubleColonIndex === 0) {
                // If * occurs at the beginning.
                // Replace it with :
                ipv6Array.splice(0, 1, ":");
            }
            else if (doubleColonIndex === ipv6Array.length - 1) {
                // If * occurs at the end.
                // Replace it with :
                ipv6Array.splice(-1, 1, ":");
            }
            else {
                // If * exists somewhere neither at the beginning nor end.
                // Replace it with empty string.
                ipv6Array.splice(doubleColonIndex, 1, "");
            }                
            
            // Finally return ipv6 as string.
            ipv6 = ipv6Array.join(":");
            return ipv6;                
            
        } catch (error: any) {
            console.log(error);
            return new Error(error.message);
        }
        
    }


    static isHex(hex: string): boolean {
        /**
         * This method checks if a given character(s) is a 
         * valid hex character.
         */

        const validHexChars = [
            "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
            "a", "b", "c", "d", "e", "f",
        ]

        for (const char of hex) {
            const isValid = validHexChars.includes(char.toLocaleLowerCase());
            
            // If not valid then return false.
            if (!isValid) {                    
                return false;
            }
        }
        
        // Otherwise valid.
        return true
    }

    static isBinary (bin: string): boolean {
        /**
         * This method checks if given character(s) is a valid binary
         * characters.
         */

        const validBinaryChars = ["0", "1"];
        
        for (const bit of bin) {
            const isValid = validBinaryChars.includes(bit);

            // If not valid return false.
            if (!isValid) {
                return false;        
            }    
        }        

        // Otherwise valid.
        return true;
    }


    static hexToBin (hex: string): string | Error{
        /**
         * This method converts hexadecimal(s) to binaries.
         * This method uses four bits to output each hex
         * and does not omit leading zeros.
        */        

        try {
            // Check input.
            // If char is not valid hex then throw an error.
            if (!this.isHex(hex)) throw new Error("Invalid Hex character entered!")


            let binaries = "";

            /*
            Because numbers greater than (2 ** 53 - 1) lose precision 
            we have to convert individual hex from input if multiple hex 
            are given rather than the whole hexadecimals in one go.        
            */
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
            
        } catch (error: any) {
            console.log(error);
            return new Error(error.message);
        }
        
    }


    static binToHex (bin: string): string | Error {
        /**
         * This method will convert binaries to hexadecimal(s).
         * This method does not omit leading zeros.
         * This method assumes that the input binaries is a multiple of 4
         * to get accurate results.
         */

        try {
            // Check input.
            // Valid binaries are 1 and 0 only.            
            if (!this.isBinary(bin)) throw new Error("Invalid Binary character entered!");    
            
            let hexadecimals: string = "";  // To be returned.            

            /*
            Because number greater than (2 ** 53 - 1) lose precision and it's outside
            Javascript max safe integers, we will use BigInt data type instead of number.            
            */

            // Convert binaries to hex.
            const result = (BigInt(`0b${bin}`)).toString(16);

            /*
             Check for leading zeros.
             If bin.length > nibbleCount then leading zero(s) are omitted
             and we're going to include it.
             nibbleCount is contigious binaries that is a multiple of 4.
            */
            const nibbleCount = result.length * 4;
            if (bin.length > nibbleCount) {
                // result.length equals hex digit(s).
                const zerosToPrepend = Math.ceil(bin.length / 4) - result.length;
                hexadecimals = "0".repeat(zerosToPrepend) + result;
                return hexadecimals;
            }
                        
            // Otherwise no leading zeros.
            hexadecimals = result;
            return hexadecimals;

        } catch (error:any) {
            console.log(error);
            return new Error(error.message);
        }        
    }


    static decToBin (int: string): string | Error{
        /**
         * This method will convert integers to binary format.
         * int param is in a string format because javascript 
         * cannot read integers outside js max safe integers.
         * This method will use BigInt type.
         */

        try {            
            /*
             Check input.
             BigInt will only accept either integers or a string that
             only contains integer characters. Otherwise it will throw
             a syntax error.
            */
            const dec = BigInt(int);

            // Convert to binary.
            const binaries = dec.toString(2);

            // Return binaries.
            return binaries;
            
        } catch (error: any) {
            console.log(error);
            return new Error(error.message);
        }
    }


    static binToDec (bin: string): BigInt | Error {
        /**
         * This method will convert binaries to decimal(BigInt).
         */

        try {
            // Check input.
            if (!this.isBinary(bin)) throw new Error("Invalid Binary character entered!");
            
            // Convert bin to bigint.
            const dec = BigInt(`0b${bin}`);

            // Return decimal.
            return dec;
            
        } catch (error: any) {
            console.log(error);
            return new Error(error.message);
        }
    }


    static hexToDec (hex: string) {
        /**
         * This method will convert hexadecimal(s) to decimal(BigInt).
         */

        try {
            // Check input.
            if (!this.isHex(hex)) throw new Error("Invalid Hex character entered!");

            // Convert hex to bigint.
            const dec = BigInt(`0x${hex}`);

            // Return decimal.
            return dec;

        } catch (error: any) {
            console.log(error);
            return new Error(error.message);
        }
    }


    static decToHex (int: string) {
        /**
         * This method will convert integers to hexadecimals.
         * int param is in a string format because javascript 
         * cannot read integers outside js max safe integers.
         */

        try {
            /*
             Check input.
             BigInt will only accept either integers or a string that
             only contains integer characters. Otherwise it will throw
             a syntax error.
            */
             const dec = BigInt(int);

             // Convert to hexadecimals.
             const hex = dec.toString(16);
 
             // Return hexadecimals.
             return hex;

        } catch (error: any) {
            console.log(error);
            return new Error(error.message);
        }
    }

    
    static ipv6ToBin (ipv6Address: string): string[] | Error {
        /**
         * This method will convert ipv6 address into contiguous binaries.
         * This method assumes that the address input is unabbreviated.
         * This method returns an array of binaries so that it leaves you a choice
         * to turn it into a colon notation or leaves it as a contiguous binaries.
         */

        try {
            // Check the input first.
            if (this.ipv6Format(ipv6Address) === false) throw new Error("Invalid IPv6 Address");                    

            /*
             Make sure that the address input is unabbreviated.
             Turn the address input into an array of segments.
             Because expand() method can return either a string or an Error
             let's do narrowing. So that Typescript knows what type of value
             we want to work with.
            */
            const expandResult = this.expand(ipv6Address);
            let ipv6Array: Array<string> = [];
            let segmentsArray: Array<string> = []; // To be returned.

            if (typeof expandResult === "string") {
                // If result is a string, then Typescript knows we want to work with string.
                // result variable is now of type string.
                ipv6Array = expandResult.split(":")

                // Turn each segments of hex(s) into segments of binaries and set them to segmentsArray.
                segmentsArray = ipv6Array.map(elem => {
                    // Because hexToBin method can return either a string or an error, do narrowing.
                    const toBinResult = this.hexToBin(elem);

                    if (typeof toBinResult === "string") {
                        // toBinResult now a string.
                        return toBinResult;    
                    } else {
                        // toBinResult now an object of type Error.
                        throw new Error(toBinResult.message);
                    }                    
                })

                // Finally return an array of segments of binaries.
                return segmentsArray; 
            } else {
                /*
                 Otherwise result is an Error.
                 result variable is now of type Error(which is actually a function type
                 because Error is a function constructor).
                */
                throw new Error(expandResult.message);
            }        

        } catch (error:any) {
            console.log(error);
            return new Error(error.message);
        }                
    }


    static binToIPv6 (bin: string): string | Error {
        /**
         * This method converts ipv6 written in contiguous binaries into ipv6 written
         * in hexadecimals and in a colon notation.
         * This method assumes that the binaries is a complete 128 bits.
         */

        try {
            // Check the input first.            
            if (!this.isBinary(bin)) throw new Error("Invalid binary character entered!");
            if (bin.length !== 128) throw new Error("Input must be a 128-bit binaries!");            

            // Convert binaries to hexadecimals.
            let hexs: string;
            let ipv6Address = ""; // To be returned.
            let nibbleCount = 0;

            /*
             Because binToHex() method can return either a string or an Error
             let's do narrowing. So that Typescript knows what type of value
             we want to work with.
            */
            const result = this.binToHex(bin);

            if (typeof result === "string") {
                // If result is a string, then Typescript knows we want to work with string.
                // result variable is now of type string.
                hexs = result;

                // Then turn them in a ipv6 address format which is in a colon notation.
                for (let index = 0; index < hexs.length; index++) {
                    const element = hexs[index];

                    // Add a colon every four hex but not at the end of the addresss.
                    if (nibbleCount === 4 && index !== hexs.length - 1) {
                        ipv6Address += ":"
                        // Reset every count.
                        nibbleCount = 0;                
                    }

                    ipv6Address += element;

                    nibbleCount++;   
                }

                // Return ipv6 address.
                return ipv6Address;

            } else {
                /*
                 Otherwise result is an Error.
                 result variable is now of type Error(which is actually a function type
                 because Error is a function constructor).
                */
                throw new Error(result.message);
            }            

        } catch (error: any) {
            console.log(error);
            return new Error(error.message);
        }         
    }


    static bitsToBin (bits: number, addressPortion: string): string | Error{
        /**
         * This method will convert number of bits to binaries.
         * because dec to bin will not work outside of safe integers
         * we have to improvise another way of solving it using
         * this method.
         */

        try {
            /*
             This method will convert only to prefix, first and last addresses
             of interfaceID portion.
             prefix: interfaceID is all 0s
             first: interfaceID is all 0s except 1 for the last element.
             last: interfaceID is all 1s.
            */
            
            const convertTo = ["prefix", "first", "last"];
            if (!convertTo.includes(addressPortion)) throw new Error("Invalid address portion!");

            let interfaceIDPortion: string; // To be returned.

            if (addressPortion.toLowerCase() === "prefix") {
                interfaceIDPortion = "0".repeat(bits);
            }
            else if (addressPortion.toLowerCase() === "first") {
                interfaceIDPortion = "0".repeat(bits - 1) + "1";
            }
            else {
                interfaceIDPortion = "1".repeat(bits);
            }

            return interfaceIDPortion;

        } catch (error: any) {
            console.log(error);
            return new Error(error.message);
        }
    }


    static getPrefix (ipv6Address: string, prefixLength: number, subnetBits: number, subnetToFind: string="0"): Prefix | Error {
        /**
         * This method will list prefix(subnet) based on the value of prefixToFind.
         * This method assumes that the address input is unabbreviated.
         * The subnetToFind parameter is of type string to store numbers outside
         * JS max integers, then convert it to BigInt type.
         */

        try {
            // Check input.
            if (this.ipv6Format(ipv6Address) === false) throw new Error("Invalid IPv6 Address!");
            if (prefixLength <= 0 || prefixLength >= 128) throw new Error("Invalid Prefix Length!");            
            if (BigInt(subnetToFind) < 0 || BigInt(subnetToFind) > (BigInt(2 ** subnetBits) - 1n)) throw new Error(`Subnet ${subnetToFind} does not exists!`);
            
            /*
             Make sure that the input address is unabbreviated.
             Then convert it to contiguous binaries.
             Since expand() and ipv6ToBin methods result in
             two different types. Let's forced the result into 
             particualr type and do narrow types. 
            */
            const result = this.ipv6ToBin(String(this.expand(ipv6Address)));
            let ipv6Bin: string = "";
            if (result instanceof Array) {
                ipv6Bin = result.join("");
            }             
            const newPrefixLength: number = prefixLength + subnetBits;
            const interfaceIDBits: number = 128 - newPrefixLength;
            const networkPortionBits: number = prefixLength;
            const networkPortionBin: string = ipv6Bin.slice(0, networkPortionBits);
            const subnetNumber: BigInt = BigInt(subnetToFind);            

            // console.log(networkPortionBin)
            // Declare Prefix object initialize prefix properties.
            const prefix = new Prefix();            
            
            // Set subnet number.
            prefix.subnetNumber = subnetNumber;            
            
            // Set network portion in binaries.
            prefix.networkPortion = networkPortionBin;

            // Set the new prefix length.
            prefix.newPrefixLength = newPrefixLength;
            
            // Set the subnet portion.
            // Convert subnet number to binaries.
            const subnetBin = subnetNumber.toString(2);
            // Prepend leading zeros because the toString method doesn't include leading zeros.
            const zerosToPrepend = subnetBits - subnetBin.length;
            // If not subnetted, then the subnet portion is 0.
            if (subnetBits === 0) {
                prefix.subnetPortion = "";
            } else {
                // Otherwise subnetted.
                prefix.subnetPortion = "0".repeat(zerosToPrepend) + subnetBin;
            }

            // Initialize the interfaceID portion object.
            // Set the bits property.
            prefix.interfaceIDPortion.bits = interfaceIDBits;
            // Note: bitsToBin method results to two types, let's just forced the result to be a string by using the String function.
            // Set the interfaceID's prefix(Network Address in ipv4) portion.
            prefix.interfaceIDPortion.prefix = String(this.bitsToBin(interfaceIDBits, "prefix")); // Binaries.
            // Set the interfaceID's First Usable Address portion.
            prefix.interfaceIDPortion.firstUsableAddress = String(this.bitsToBin(interfaceIDBits, "first")); // Binaries.
            // Set the interfaceID's Last Usable Address portion.
            prefix.interfaceIDPortion.lastUsableAddress = String(this.bitsToBin(interfaceIDBits, "last")); // Binaries.

            // Set the prefix's prefixID(Network Address in ipv4), first and last usable addresses.
            // Note: binToIPv6 method results to two types, let's just forced the result to be a string.
            // Set the prefix.                        
            prefix.prefix = String(this.binToIPv6(prefix.networkPortion + prefix.subnetPortion + prefix.interfaceIDPortion.prefix));
            // Set the First Usable Address.
            prefix.firstUsableAddress =  String(this.binToIPv6(prefix.networkPortion + prefix.subnetPortion + prefix.interfaceIDPortion.firstUsableAddress));
            // Set the Last Usable Address.
            prefix.lastUsableAddress =  String(this.binToIPv6(prefix.networkPortion + prefix.subnetPortion + prefix.interfaceIDPortion.lastUsableAddress));
                 
            // Finally return prefix object.
            return prefix;            

        } catch (error: any) {
            console.log(error);
            return new Error(error.message);
        }        
    }


    static macaFormat (macAddress: string): boolean {
        /**
         * This method uses regular expression to check user's input against 
         * mac address three valid format: colon notation, hyphen notation 
         * and contiguous hexadecimals.
         */

        // This will match three valid mac address format.        
        const macaPattern = /^(([a-f0-9]{2}(-|:)?){6})$/i;
                
        // Test user's input.
        const result = macaPattern.test(macAddress);
        if (!result) {
            // If result is false(user's input is invalid), return false.
            return false;
        }

        // Otherwise valid.
        return true;
    }


    static eui_64 (macAddress: string): string | Error {
        /**         
         * This method will generate the interfaceID part of an ipv6 address
         * using the modified extended unique modifier 64 or just eui-64.
         * This method assumes that the input is in lowercase.
         */

        try {
            // if (this.ipv6Format(ipv6Address) === false) throw new Error("Invalid ipv6 address!");
            if (this.macaFormat(macAddress) === false) throw new Error("Invalid mac address!");

            /*
             Algorithm for eui-64 to generate the interface ID.
              1. Split the mac address in two halves.
              2. Insert FFFE in the middle.
              3. Convert the resulting interface ID to binaries, 
                 invert the seventh bit of the interface ID.
              4. Convert it back to hexadecimals and add a colon every
                 four hex digits.
            */

            // Let's create an index signature.                 
            interface StringArray {
                [index: string]: string
            }
            const seventhBitConversion: StringArray = {
                0: "2", 1: "3", 2: "0", 3: "1", 4: "6", 5: "7", 6: "4", 7: "5",
                8: "a", 9: "b", a: "8", b: "9", c: "e", d: "f", e: "c", f: "d",
            }
            let interfaceID = '';
            let fourCount = 0;
            // Convert the mac address into an array of hexs.
            let macArray: Array<string>;

            if (macAddress.includes(":")) {
                macArray = macAddress.split(":");
            } else if (macAddress.includes("-")) {
                macArray = macAddress.split("-");
            } else {
                macArray = macAddress.split("");
            }

            // Split the mac adddress in two havles and insert FFFE in the middle.
            const toInsertAt = macArray.length / 2;
            macArray.splice(toInsertAt, 0, "FFFE");

            /*
             In here instead of converting the hexs into binaries, we're gonna use
             the decimal shortcuts of inverting the seventh bit. Because inverting 
             the seventh bit means changing the value of the second hex of the 
             interface ID. So make sure that the macArray is an array of single hex
             digits.
            */
            macArray = macArray.join("").split("");

            // Change the value of the second hex(invert the seventh bit) based on the seventhBitConversion above.
            const secondHex = macArray[1];
            for (const key in seventhBitConversion) {
                if (secondHex === key) {
                    macArray[1] = seventhBitConversion[key]
                }                
            }
            
            // Add a colon every four hex digits.
            for (const hex of macArray) {
                if (fourCount === 4) {                    
                    interfaceID += ":";
                    // reset the count.
                    fourCount = 0;
                }
                interfaceID += hex
                fourCount++;
            }
            
            // Finally return the interface ID.
            return interfaceID.toLowerCase();

        } catch (error: any) {
            console.log(error);
            return new Error(error.message);
        }
    }


    static ipv6_eui64 (ipv6Address: string, macAddress: string): string | Error {
        /**
         * This method will generate a unicast ipv6 address using the 
         * eui-64 logic.
         */

        try {
            // Check inputs.
            if (ipv6Address === '') throw new Error("Include an IPv6 Address in the background!");
            if (!this.ipv6Format(ipv6Address)) throw new Error("Invalid IPv6 Address!");            
            if (!this.macaFormat(macAddress)) throw new Error("Invalid MAC Address!");

            // Expand the ipv6 address first.
            const result = this.expand(ipv6Address) as string
            
            // Get the first 64 bits of the ipv6 address.
            const networkPortion = result.slice(0, 20);
            
            // Get the interface ID.
            const interfaceID = this.eui_64(macAddress) as string;
            
            // Combine the network portion and the interface ID.
            const unicastIPv6 = networkPortion + interfaceID;

            // Finally return unicast ipv6 address abbreviated.
            return this.abbreviate(unicastIPv6);
            
        } catch (error: any) {
            console.log(error);
            return new Error(error.message);
        }
    }


    static linkLocal (macAddress: string): string | Error {
        /**
         * This method will generate the ipv6 unicast Link-Local address
         * that we see on host(s). It will use the cisco router's way of
         * making the interface ID part of the address and that is using
         * the eui-64 method. Note that the Link-Local unicast starts with
         * the prefix FE80/10 with the remaining 54 bits should be all 0s
         * per RFC: FE80::/64.
         * This method assumes that the input is in lowercase.
         */

        try {
            // Check input(s).
            if (this.macaFormat(macAddress) === false) throw new Error("Invalid Mac Address!");

            // Link-Local prefix.
            const linkLocalPrefix = "FE80::";

            // Get the interface ID using eui-64 logic.
            const interfaceID = this.eui_64(macAddress) as string;

            /*
             Combine the Link-Local prefix and the interface ID to generate the
             unicast link-local address.
            */
            let linkLocalAddress = linkLocalPrefix + interfaceID;

            // We usually see the link-local unicast abbreviated on host(s), so abbreviate it.            
            // Expand it first. 
            const expand = this.expand(linkLocalAddress.toLocaleLowerCase()) as string;
            // Then abbreviate it.
            const abbreviate = this.abbreviate(expand) as string;
            linkLocalAddress = abbreviate;
            
            // Finally return the unicast link-local address.
            return linkLocalAddress;

        } catch (error: any) {
            console.log(error);
            return new Error(error.message);
        }
    }


    static solicitedNode (ipv6Address: string) {
        /**
         * This method will generate a Solicited-Node Multicast Address.
         * All solicited-node starts with the predefined /104 prefix (26 hex digits),
         * which is FF02::1:FF defined by RFC. Then the last 24 bits (6 hex digits),
         * copy the last 6 hex digits of the unicast address into the solicited-node
         * address.
         * This method assumes that the input address is in lowercase.
         */

        try {
            // Check input.
            if (this.ipv6Format(ipv6Address) === false) throw new Error("Invalid IPv6 Address");

            let solicitedNodeAddress = ''; // To be returned.
            let fourCount = 0; // Counter.

            // Solicited Node prefix: FF02::1:FF /104.
            const solicitedNodePrefix = "FF0200000000000000000001FF";

            /*
             Get the last 6 hex digits of an ipv6 unicast address.
             Make sure that the input address in not abbreviated.             
            */
            const ipv6 = this.expand(ipv6Address) as string;
            // Convert it to array.
            let ipv6Array: Array<string> = ipv6.split(":");
            // Then convert it to contiguous hex digits, then slice the last 6 hex digits.            
            const sixHexDigits = ipv6Array.join("").slice(-6);

            // Combine the solicited-node prefix and the last 6 hex digits.
            const result = solicitedNodePrefix + sixHexDigits;
            console.log(result)
            // Add a colon every four hex digits.
            for (const hex of result) {
                if (fourCount === 4) {                    
                    solicitedNodeAddress += ":";
                    // reset the count.
                    fourCount = 0;
                }
                solicitedNodeAddress += hex
                fourCount++;
            }
            
            // We usually see the solicited-node unicast abbreviated on host(s), so abbreviate it.
            // Expand it first.
            const expand = this.expand(solicitedNodeAddress.toLowerCase()) as string;
            // Then abbreviate it.
            const abbreviate = this.abbreviate(expand) as string;
            solicitedNodeAddress = abbreviate;

            // Finally return the solicited-node multicast address.
            return solicitedNodeAddress;

        } catch (error: any) {
            console.log(error);
            return new Error(error.message);
        }        
    }


}

