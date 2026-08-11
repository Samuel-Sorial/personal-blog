---
title: "Query Execution - Joins"
description: "Introduction\nJoins are used to combine data from multiple tables in a database and retrieve the combined data as a single result set. This allows us to effectively retrieve data that is spread across multiple tables and can be especially useful when …"
publishDate: 2022-12-29T14:29:50.000Z
tags: ["Databases","query-execution","joins"]
draft: false
canonicalUrl: "https://samuelsorial.com/query-execution-joins"
---
<h1 id="heading-introduction">Introduction</h1>
<p>Joins are used to combine data from multiple tables in a database and retrieve the combined data as a single result set. This allows us to effectively retrieve data that is spread across multiple tables and can be especially useful when working with large datasets. In this article, we will discuss how DBMS executes those joins.</p>
<h1 id="heading-join-operator-output">Join Operator Output</h1>
<p>In the given query, the planner noticed that a join is required, thus it inserted a join operator in the query plan. This operator gets its input from both tables R, S. However, its output can vary a lot depending on:</p>
<ul>
<li><p>Processing Model</p>
</li>
<li><p>Storage Model</p>
</li>
<li><p>Query itself</p>
</li>
</ul>
<p><img src="/images/posts/4a1e1eac-47ca-45d4-860a-1cff81e22d05.png" alt class="image--center mx-auto" /></p>
<h2 id="heading-1-data">1- Data</h2>
<p>In this type, the operator outputs the actual data of the record. It does so by copying the whole attributes that it receives (from the previous operator) along with the record that was matched.</p>
<p><img src="/images/posts/1e7d1428-1a37-421b-8653-b60216c026fc.png" alt class="image--center mx-auto" /></p>
<p>One main advantage of it is that the next operators on the plan, don't need to go back for the pages to get the remaining attributes they may need. This is suitable for row-based databases, as the whole row is stored on the same page continuously. So, the cost of retrieving all attributes is not so huge.</p>
<h2 id="heading-2-recordids">2- RecordIds</h2>
<p>In this type, the operator outputs only the RecordIds of the tuples that matched the join, and the next operators on the plan consume them and retrieve only attributes it needs on demand (late-materialization).</p>
<p><img src="/images/posts/00d93d56-3291-4158-a5f9-30b99bccddd1.png" alt class="image--center mx-auto" /></p>
<p>It's ideal for columnar databases because it doesn't fetch pages for attributes that won't be used later in the plan.</p>
<h1 id="heading-join-operator-algorithms">Join Operator Algorithms</h1>
<p>Cost analysis terms used: we will use the R table, which has M pages stored on disk, and m records. S table with N pages on the disk, and n records.</p>
<h2 id="heading-1-nested-loop-join">1- Nested Loop Join</h2>
<h3 id="heading-simple-nested-loop-join">* Simple Nested Loop Join</h3>
<p>This is the most straightforward algorithm to do joins, just brute-force and output the data.</p>
<pre><code class="lang-plaintext">foreach tuple r in R:
    foreach tuple s in S:
        emit if r and s match
</code></pre>
<p><img src="/images/posts/0e0d567b-e615-40bb-ac2f-4326c0ade5d0.png" alt class="image--center mx-auto" /></p>
<p>Cost of running R (bigger pages) as an outside table: M + (m*N)</p>
<p>Example dataset where M = 1000, N = 500, m = 100,000, n = 40,000</p>
<p>Cost = 1000 + (100,000 * 500) = 50,001,000 I/Os</p>
<p>Cost of Running S (smaller pages) as an outside table: N + (n*M)</p>
<p>Cost = 500 + (40,000 * 1000) = 40,000,500 I/Os</p>
<p>As we can see, running the smaller table as the outside table makes it run faster (while it's still too slow).</p>
<h3 id="heading-block-nested-loop-join">* Block-Nested Loop Join</h3>
<p>In this algorithm, we try to reduce page fetches using the same brute force algorithm, but being a little bit smarter about page fetches, maximizing the utilization of each page fetched.</p>
<pre><code class="lang-plaintext">foreach block br in R:
    foreach block bs in S:
        foreach tuple r in br:
            foreach tuple s in bs:
                emit if r and s matches
</code></pre>
<p><img src="/images/posts/0e0d567b-e615-40bb-ac2f-4326c0ade5d0.png" alt class="image--center mx-auto" /></p>
<p>Cost: M + (M*N) = 1000 + 500*1000 = 501,000 I/Os. It's apparent that there's a huge optimization, the previous one was 50,001,000 I/Os (100x more I/Os)</p>
<p>Again, using the smaller table in terms of pages optimizes this a little bit.</p>
<p>This algorithm becomes better and better if we have a larger buffer, and if we are lucky enough to fit all pages in memory, it will be M+N I/Os.</p>
<h3 id="heading-index-nested-loop-join">* Index Nested Loop Join</h3>
<p>We can avoid too many sequential scans by an index to find table matches.</p>
<pre><code class="lang-plaintext">foreach tuple r in R:
    foreach tuple s in index(ri = si):
        emit r,s if matches
</code></pre>
<p>In this algorithm, we use the outer table which has no index, and the inner which has an index. By doing so, we can search for values using the index instead of doing sequential scans every time we need to find a matching.</p>
<p>Cost: M + (m*C) where C is the cost of searching an index for a specific value, which depends on the implementation of the index.</p>
<h2 id="heading-2-sort-merge-join">2- Sort-Merge Join</h2>
<p>It's basically consisting of two phases:</p>
<p>Phase 1: Sort both tables on the join keys, <a target="_blank" href="https://samuelsorial.tech/query-execution-aggregations#heading-sorting">sorting algorithm</a> can be determined based on whether it fits in memory or not.</p>
<p>Phase 2: Merge by looping with two cursors, and emit matches only.</p>
<pre><code class="lang-plaintext">sort R, S on join keys
cursorR = firstSortedR, cursorS = firstSortedS
while cursorR and cursorS:
    if cursorR &gt; cursorS:
        increment cursorS
    else if cursorS &gt; cursorR:
        increment cursorR
    else if cursorR matches cursorS:
        emit
        increment cursorS
</code></pre>
<p><img src="/images/posts/808af136-1903-4152-9c2b-91ebf0e0be36.png" alt class="image--center mx-auto" /></p>
<p>Start the matching process</p>
<p><img src="/images/posts/d64242d9-3083-403b-acdc-d9bcad8a5459.png" alt class="image--center mx-auto" /></p>
<p>The case when the cursor of s is larger than the cursor of r</p>
<p><img src="/images/posts/dda53652-7ba4-445d-a80f-8aa762f178e5.png" alt class="image--center mx-auto" /></p>
<p>Important note: sometimes we might need to backtrack because we might lose some matching if we just skipped to the next without thinking.</p>
<p>In the case when we reach r = 200, we will find a match on s = 200, and by following the algorithm, we will increase s cursor, and it will point to 400.</p>
<p>Now, r cursor will be less than s cursor, so increase it, but eventually, we will find 200 in r cursor again, but at the same time, s cursor is at 400, it might skip and don't return a matching, however, it has a matching that should be included. We can backtrack s cursor to the previous value of 200, to check whether it matches or not.</p>
<p><img src="/images/posts/002dd2a6-5a5e-4c37-9014-d6a14ed6ff02.png" alt class="image--center mx-auto" /></p>
<p>We need to backtrack</p>
<p><img src="/images/posts/0f2beb2d-a975-4ad8-b963-f4c729d04d7d.png" alt class="image--center mx-auto" /></p>
<p>The backtracking here is so simple, only the previously matched value should be backtracked, so it doesn't have a huge impact on the algorithm performance.</p>
<p>Cost: Sort + Merge</p>
<p>Sort(R) = 2M ∙ (1 + ⌈ logB-1 ⌈M / B⌉ ⌉), Sort(S) = 2N ∙ (1 + ⌈ logB-1 ⌈N / B⌉ ⌉)</p>
<p>Merge = M+N</p>
<p>Using sample dataset as previous algorithms, with B buffer pages = 100</p>
<p>Sort(R) = 4000 I/Os, Sort(S) = 2000 I/Os, Merge = 1500 I/Os</p>
<p>Total = 7500 I/Os</p>
<p>It's a lot better than nested loop join!</p>
<p><strong>When it's used?</strong></p>
<p>It's suitable when on or both tables are sorted on the keys (has a tree table), or when the output should be sorted using the matching keys. Also, if there's an existing index on the matching keys, it will remove the cost of sorting as it's already sorted, which makes it much faster.</p>
<h2 id="heading-3-hash-join">3- Hash Join</h2>
<p>Hashing can help us to identify matching, by building a hashtable from one table and using it to find matches.</p>
<p>Phase 1: Build the table, by using the outer table, hash every matching key and store it in the table (if the outer table is smaller, this means less hashtable size)</p>
<p>Phase 2: Probe the table by scanning the inner table, hashing each matching key, and looking at the hashtable to find matches of it.</p>
<pre><code class="lang-plaintext">buld hashtable HTr from R
foreach tuple s in S:
   emit if h(s) in HTr
</code></pre>
<p><img src="/images/posts/933606e8-232d-4a9e-9bf5-8572ad90f0d0.png" alt class="image--center mx-auto" /></p>
<p>We can build a bloom filter during the build phase, which indicates when the key is likely not to be in the hash table. In the probe phase, Before each jump on the hash table, we check the bloom filter, if it says it has the key, it's safe to assume it's there, and there's no need to check the hashtable. However, bloom filters produce negative false, which means that it may say that a specific key is not there, but it's in the table. So, we need to look at the hashtable to know precisely.</p>
<p>As a bloom filter is usually small, we can keep it in memory, which reduces I/O.</p>
<p>Cost: 3 <em>(M+N) = 3</em> * (1000 + 500) = 4500 I/Os. Less than sort-merge.</p>
<p>This cost can be reduced by using static hashing, if DB knows the size of the outer table before starting, which depends on the implementation of the DBMS.</p>
<p>In general, hashing is almost better than sorting when it comes to joining operator, however, it might be worst if data is non-uniform, or we need to sort results before returning. Usually, DBMS use either of them depending on the query.</p>
<h1 id="heading-references"><strong>References</strong></h1>
<ul>
<li><p>CMU15-445/645 Database Systems lecture notes. Retrieved from: <a target="_blank" href="http://15445.courses.cs.cmu.edu/fall2019"><strong>15445.courses.cs.cmu.edu/fall2019</strong></a></p>
<p>  Note: ChatGPT was used to help me refine and make this post more concise, and readable, and provided some examples. So huge thanks to <a target="_blank" href="https://openai.com/"><strong>OpenAI</strong></a>!</p>
</li>
</ul>
