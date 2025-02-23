# zkJSON v2

zkJSON v2 leverages bit-level optimizations to encode JSON at lightning speed while compressing data more efficiently than other self-contained JSON encoding/compression algorithms, such as [MessagePack](https://msgpack.org/) and [CBOR](https://datatracker.ietf.org/doc/html/rfc7049).


## How zkJSON Outperforms Every Other Encoding Algorithm

MessagePack generates the smallest encoded data sizes among existing self-contained JSON serialization formats. However, zkJSON outperforms MessagePack in 90% of cases with random data, with the remaining 10% yielding nearly identical sizes. More importantly, for structured data with repetitive patterns and duplicate values, zkJSON far surpasses MessagePack, achieving up to a 90% better compression rate.

How could beating the current status quo even be possible at all, let alone by a wide margin?

- **Bit-level optimization over traditional byte-level encoding**  
  MessagePack and other serialization algorithms are optimized at the byte level, often leaving unused bits scattered throughout the encoded data. Since 1 byte consists of 8 bits, data is typically packed into bytes in a way that aligns with standard memory structures. In contrast, zkJSON leverages bit-level optimizations with variable-length data units, ensuring that every bit is utilized efficiently, leaving no space wasted.
  
- **Columnar structure reorganization for enhanced compression**  
 As zkJSON scans JSON data, it dynamically reorganizes it into a columnar structure. Modern databases achieve high performance by storing values of the same field together, which naturally results in sequences of similar data. This structural alignment makes data size more uniform and predictable, increasing redundancy and minimizing differences between neighboring values, ultimately leading to superior compression efficiency.
  
- **Delta packing for efficient storage of sequential and repetitive data**  
  zkJSON leverages its columnar structure to encode differences between consecutive values and efficiently pack repeating sequences. Since meaningful data naturally forms patterns—whether timestamps, counters, or structured records—delta packing takes full advantage of these repetitions, drastically reducing storage and improving compression efficiency.
  
- **Simple, Deterministic, and Metadata-Efficient**  
  Despite its advanced compression capabilities, zkJSON is based on simple deterministic principles. With just a single scan, it dynamically applies bit-level optimizations, columnar reorganization, and delta packing without requiring multiple passes or complex heuristics. The deterministic order eliminates the need for unnecessary metadata, further reducing storage overhead and ensuring a compact and streamlined encoding process.
  
- **Direct Data Extraction and ZK Compatibility**  
  zkJSON’s structured encoding allows data to be accessed directly without full decoding, making it highly efficient for on-the-fly processing. This is especially important for zero-knowledge circuits (ZK circuits), where only arithmetic operations are allowed, eliminating the need for costly parsing. Additionally, zkJSON’s compact and predictable format enables EVM assembly-level optimizations, reducing gas costs and improving execution efficiency in blockchain environments.
