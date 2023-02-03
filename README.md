# IPv6 Subnetting
IPv6 Address subnetting is the process of splitting a network into smaller networks known as Subnets.
I developed this app as one of my personal projects and this can help you whenever your learning or
practicing ipv6 subnetting.

This is also useful if you're going for the CCNA exam or any other equivalent certifications
because it has features that check your work with other stuffs included in the exam.

## How to use this app?
1. Enter an IPv6 Address.
2. Enter a Prefix Length (CIDR in IPv4).
3. Enter Subnet bits (or borrowed bits) for the subnet portion.
4. Click the submit button.

## About the features?
Conversions
- Bin to Hex
  - This option will convert binaries to hexadecimals and vice versa.
- Dec to Bin
  - This option will convert decimals to binaries and vice versa.
- Hex to Dec
  - This option will voncert hexadecimals to decimals and vice versa.

Validations
- IPv6 Address Format
  - This option will check user's input if it's valid ipv6 address.
- MAC Address Format
  - This option will check user's input if it's valid mac address.
- IPv6 Address type
  - This option will check user's input its type of ipv6 address.
- Multicast Scope
  - This option will determine the scope of a multicast address.

Generators
- Interface ID
  - This option will generate an **interface ID** using the **EUI-64** logic that most routers used.
- IPv6 Address
  - This option will generate an **ipv6 unicast address** using the **EUI-64** logic.
    The user can only put the first 64 bits of an ipv6 address (first 32 hex digits) and then a mac address.
- Link-Local Address
  - This option will generate a **link-local unicast address** using the prefix **FE8/10** and the **EUI-64** logic.
- Solicited-node Address.
  - This option will generate a **solicited-node multicast address**.

Utilities
- Abbreviate
  - This option will abbreviate an ipv6 address by removing leading zeros in each segment and substitute :: (double-colon)
    for a series of two or more segments of all zeros.
- Expand
  - This option will expand an abbreviated ipv6 address by reversing the process of abbreviation method.

## License
This repository is using the default license which means this repo cannot be used for any purposes.



