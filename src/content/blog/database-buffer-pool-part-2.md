---
title: "Database Buffer Pool - Part 2"
description: "A closer look at database buffer replacement policies, including LRU, clock algorithms, and workload-aware memory management."
publishDate: 2022-10-27T21:00:42.000Z
tags: ["database","caching","memory-management","LRU Cache","Databases"]
draft: false
canonicalUrl: "https://samuelsorial.com/database-buffer-pool-part-2/"
---
<h2 id="heading-introduction">Introduction</h2>
<p>As explained in <a href="/database-buffer-pool-part-1/">Database Buffer Pool - Part 1</a>, a buffer pool is a limited chunk of memory, which means that whenever we bring something from the disk, we need to evict something from the buffer pool and replace it. Buffer replacement is one of the most important topics for memory management in DBMS.</p>
<h2 id="heading-operating-system-page-cache">Operating-System Page Cache</h2>
<p>Before digging into buffer pool replacement policies, we should know that there's another layer of caching, which is the OS page cache. When using OS API to do disk operations, the OS maintains its own filesystem cache, however, this cache can be bypassed. In our case, it's more common to bypass this cache, in order to avoid having a memory full of the same pages cached in different layers. Also, it allows the DBMS to manage its eviction policy, and improve its durability and recovery policy.</p>
<p>It is worth knowing that in case of using a DBMS that's not using OS cache, it requires giving it more memory to have sufficient cache, however, if DBMS is using OS cache, it requires less memory, therefore OS can have memory to manage his cache (like PostgreSQL).</p>
<h2 id="heading-buffer-replacement-policies">Buffer Replacement Policies</h2>
<p>Replacement policy is an algorithm that's used to make the decision about which page to evict. It should be correct, accurate, speedy, and doesn't consume too much memory on meta-data.</p>
<h3 id="heading-1-least-recently-used-lru">1- Least Recently Used (LRU)</h3>
<p>LRU stores a timestamp of the last access of each page. When eviction is required, it selects the page with the oldest timestamp and evicts it. This meta-data can be stored in another data structure to allow sorting & improve efficiency.</p>
<h3 id="heading-2-clock">2- Clock</h3>
<p>It's an approximation of LRU, but in this case, we don't store a timestamp, we store a reference bit. When a page is accessed, this bit is set to 1. It organizes the pages in a circular buffer with a clock hand, in case we need to evict, start sweeping, if the page bit is set to 1, then set it to 0, if it's 0, we can evict it!</p>
<p><img src="/images/posts/gJpMIaBjr.png" alt="image.png" /></p>
<h4 id="heading-problems-with-lru-and-clock">Problems with LRU and Clock</h4>
<p>Those 2 algorithms are prone to sequential flooding. Since sequential scans require all pages to be processed, it will flood the buffer pool with all pages, and in this case, timestamp or reference bit is not a great indicator of future need for it. As they were just used and will not be used in near future.</p>
<h3 id="heading-3-lru-k">3- LRU-K</h3>
<p>Instead of tracking only 1 timestamp, we keep track of the last K page references, whenever it needs to evict a page, it computes the interval between subsequent accesses, then it's used to predict future accesses. It prevents sequential flooding because in this case, the interval between accessing the same page is bigger than other pages used frequently, so it's evicted.</p>
<h2 id="heading-optimizations">Optimizations</h2>
<p>DBMS knows about the context of each page accessed during query execution, which enables it to provide hints for the buffer pool about which pages are important. Keep in mind that those hints might be respected from the buffer pool side or in some cases, it might be evicted depending on the situation.</p>
<h2 id="heading-references">References</h2>
<ul>
<li>CMU15-445/645 Database Systems lecture notes. Retrieved from: 15445.courses.cs.cmu.edu/fall2022</li>
</ul>
