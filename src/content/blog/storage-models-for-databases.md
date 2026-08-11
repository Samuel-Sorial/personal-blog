---
title: "Storage Models for Databases"
description: "Introduction\nDifferent applications have different requirements, as discussed in What the heck is OLTP, OLAP?, it depends on business rules to define the workload of our database. Therefore, we need different storage models for the database in order …"
publishDate: 2022-10-16T00:00:32.000Z
tags: ["Databases","database","database design","OLTP","OLAP"]
draft: false
canonicalUrl: "https://samuelsorial.com/storage-models-for-databases"
---
<h2 id="heading-introduction">Introduction</h2>
<p>Different applications have different requirements, as discussed in <a target="_blank" href="https://samuelsorial.tech/what-the-heck-is-oltp-olap">What the heck is OLTP, OLAP?</a>, it depends on business rules to define the workload of our database. Therefore, we need different storage models for the database in order to fulfill those workloads while maximizing the utilization of I/O and storage.</p>
<h2 id="heading-n-ary-storage-model-nsm">N-Ary Storage Model (NSM)</h2>
<p>In this model, the database stores the attributes of a single record contiguously on a page (in some cases there might be overflow). Which makes it better for OLTP workloads, as it is easy to insert a new record, or modify an existing one. Also, retrieving the whole record is not a big deal in this case, because it's stored contiguously, retrieving the page results in having all attributes. This model is used in row-store databases.
<img src="/images/posts/BtofA0vB2.png" alt="n-ary.png" /></p>
<p>Advantages:-</p>
<ul>
<li>Fast insertion, updates, deletes</li>
<li>Reduce I/O in case of retrieving the whole record (all of its attributes or most of it)</li>
</ul>
<p>Disadvantages:-</p>
<ul>
<li>Not suitable if we want to select a specific attribute or do a query using a specific attribute (we can use indexes to overcome this problem)</li>
<li>We can't do real compression because every attribute might have a different type than the next one</li>
</ul>
<h2 id="heading-decomposition-storage-model-dsm">Decomposition Storage Model (DSM)</h2>
<p>In this model, the database stores a single attribute contiguously on a page. which makes it ideal for OLAP workloads that require complex queries done on specific attributes, to do the filtering, the engine retrieves those attribute values easily because they are stored on the same pages contiguously, there's no waste of I/O to retrieve attributes that are not going to be used. It's suitable for heavy read applications.</p>
<p><img src="/images/posts/atqrrK3SD.png" alt="dsm.png" /></p>
<p>Advantages:-</p>
<ul>
<li>Less I/O because we only read attributes that are related to the query</li>
<li>Opens the door for compression, because the same types are always stored within the same pages.</li>
</ul>
<p>Disadvantages:-</p>
<ul>
<li>More complicated insert/update/delete queries, as it requires more I/O to reach different attribute pages.</li>
</ul>
<h2 id="heading-references">References</h2>
<ul>
<li>CMU15-445/645 Database Systems lecture notes. Retrieved from: https://15445.courses.cs.cmu.edu/fall2022/</li>
<li>Database Internals: A Deep Dive into How Distributed Data Systems Work 1st Edition</li>
</ul>
