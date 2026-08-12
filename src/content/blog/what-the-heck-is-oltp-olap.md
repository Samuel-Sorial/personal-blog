---
title: "What the heck is OLTP, OLAP?"
description: "A clear comparison of OLTP and OLAP database workloads, including transaction patterns, analytical queries, and system design tradeoffs."
publishDate: 2022-07-14T22:45:13.000Z
tags: ["database","Databases","OLTP","OLAP"]
draft: false
canonicalUrl: "https://samuelsorial.com/what-the-heck-is-oltp-olap/"
---
<h2 id="heading-whats-oltp">What's OLTP?</h2>
<p>OLTP stands for Online Transaction Processing, in which a database is used to execute huge amounts of transactions. Transaction means to change data, either by inserting, updating, or deleting <strong>small amounts of data</strong>. It's usually used at the first stages of any application, it manipulates some data triggering some actions like selling products, banking, and messaging.</p>
<p>As it's the DB used for operations, it should be:-</p>
<ul>
<li>ACID (Atomic, Consistent, Isolated, Durable) to support transactions <strong>correctness</strong>.</li>
<li>Rapid, to be able to fulfill huge amounts of transactions concurrently without delays</li>
<li>Highly available, because any failure in the system has a direct impact on the business operations, along with backups at short intervals to reduce data loss.</li>
</ul>
<h2 id="heading-whats-olap">What's OLAP?</h2>
<p>OLAP stands for Online Analytical Processing, in which a database warehouse is used to get information using <strong>complex queries</strong> that support decision making. It's usually used by data scientists and business analysts.</p>
<h2 id="heading-oltp-vs-olap">OLTP Vs OLAP</h2>
<ul>
<li><p>Execution time: OLTP requires the system to execute small transactions but rapidly, on the other hand, OLAP is less time-sensitive as it asks for complex queries.</p>
</li>
<li><p>Reads/Writes: OLAP workload is read intensive, while OLTP has a good balance of reads/writes.</p>
</li>
<li><p>Space: OLAP requires huge space to be able to perform the complex queries that support decision making, on the other hand, OLTP only needs the data required to perform transactions.</p>
</li>
<li><p>Backups: OLTP requires very short backup intervals to reduce any data loss, on the other side, OLAP can be backed up less frequently.</p>
</li>
</ul>
<h2 id="heading-which-to-use">Which to use?</h2>
<p>Assume you are building Amazon, then to support a customer-facing portal, you need to have an OLTP system that supports huge transaction numbers, to be able to fulfill adding products, orders, invoices, and much more. If you decided that you want to have analysis of products and what are the factors that affect sales, you might need to have an OLAP to support those types of queries. So, Depending on your business requirements, you may need to use both of them! </p>
<p>OLTP and OLAP can be implemented on the same DB, in the end, it's a conceptual model, however, doing so is not recommended as it comes with huge overhead, and you compromise some of the characteristics of each model to be able to use the same db, and single responsibility always wins!</p>
