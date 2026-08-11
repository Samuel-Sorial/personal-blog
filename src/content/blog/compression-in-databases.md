---
title: "Compression In Databases"
description: "Introduction\nIt's well-known that the database's main bottleneck lies in I/O. That's what makes database designers aim toward reducing it in any possible way, one of them is to look carefully at the workload and choose the suitable storage model (for…"
publishDate: 2022-10-17T20:21:24.000Z
tags: ["Databases","database","compression"]
draft: false
canonicalUrl: "https://samuelsorial.com/compression-in-databases"
---
<h2 id="heading-introduction">Introduction</h2>
<p>It's well-known that the database's main bottleneck lies in I/O. That's what makes database designers aim toward reducing it in any possible way, one of them is to look carefully at the workload and choose the suitable storage model (for more info <a target="_blank" href="https://samuelsorial.tech/storage-models-for-databases">Storage Models for Databases</a>). Another tool that is widely used in computer science, is to compress data before storing it and postpone decompression as long as we can (late materialization). However, DB <strong>should not lose</strong> any data in compression, which means that we get the same data that we inserted.</p>
<h2 id="heading-compression-granularity">Compression Granularity</h2>
<ul>
<li>Block-level: compress a whole block of tuples as a block, which uses a general-purpose algorithm, and it doesn't provide powerful compression (Zstd is most used).</li>
<li>Tuple-level: compress the tuple itself (NSM)</li>
<li>Attribute-level: compress single/many attributes inside the tuple (some others may not be compressed)</li>
<li>Column-level: compress multiple values of the attribute altogether (DSM)</li>
</ul>
<h2 id="heading-columnar-compression">Columnar Compression</h2>
<p>This is the most powerful compression, that's why it will be described in detail. </p>
<ul>
<li><strong>Run-Length encoding</strong>:
compress continuous occurrences of the same value in a single triplet (value, start position, length), and it requires the columns to be sorted in order to maximize the compression.</li>
</ul>
<p><img src="/images/posts/s8ZO1Ag_j.png" alt="image.png" />
If it was stored in sorted order, we could have achieved better compression: </p>
<p><img src="/images/posts/kfs3DpQH7.png" alt="image.png" /></p>
<p><em>Side note:</em> we can get rid of length, and calculate it from the start of the next triplet</p>
<ul>
<li><strong>Bit-Packing encoding</strong>:
When the values of the attributes are always less than the largest size of the attribute, cast them to a smaller data type</li>
</ul>
<p><img src="/images/posts/czjsCAdEv.png" alt="image.png" /></p>
<ul>
<li><strong>Mostly encoding</strong>:
The same as bit-packing encoding, but it handles the case that some values don't fit in the smaller data type, by creating a lookup table for those overflows.</li>
</ul>
<p><img src="/images/posts/AxxXK7ROT.png" alt="image.png" /></p>
<ul>
<li><strong>Bitmap encoding</strong>:
Store a separate bitmap for each unique value of the attribute, and represent the i position in the bitmap with the value</li>
</ul>
<p><img src="/images/posts/SRWERkXsR.png" alt="image.png" /></p>
<p>However, if the cardinality of the attribute is not low enough, we can get worse results than not using compression at all! </p>
<p><img src="/images/posts/uq4OwOMiR.png" alt="image.png" /></p>
<ul>
<li><strong>Delta encoding</strong>:
In this encoding method, we only store the difference between values following each other (we should store the base value). This method can be used along with Run-Length encoding to store the deltas in triplets.</li>
</ul>
<p><img src="/images/posts/ij0pENZdc.png" alt="image.png" /></p>
<ul>
<li><strong>Dictionary</strong>:
Replace the actual long values with values that are less in size, similar to hashing, but we can not use hashing because we want a way to decompress it, and also we want to support range queries.</li>
</ul>
<p><img src="/images/posts/V6Zt47r6p.png" alt="image.png" /></p>
<h2 id="heading-postpone-decompression">Postpone decompression</h2>
<p>As said earlier, if we are going to use compression, it's better to postpone decompression as long as we can during query execution. Supporting operations on compressed data reduces the amount of memory required for doing such operations, however, DB engine should decompress data before returning it to the client.</p>
<p><img src="/images/posts/LDc8g1-AB.png" alt="image.png" /></p>
<h2 id="heading-references">References</h2>
<ul>
<li>CMU15-445/645 Database Systems lecture notes. Retrieved from: 15445.courses.cs.cmu.edu/fall2022</li>
<li>Database Internals: A Deep Dive into How Distributed Data Systems Work 1st Edition</li>
</ul>
