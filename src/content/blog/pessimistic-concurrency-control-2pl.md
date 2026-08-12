---
title: "Pessimistic Concurrency Control - 2PL"
description: "How pessimistic concurrency control and two-phase locking coordinate database transactions while preserving correctness."
publishDate: 2023-02-08T13:22:51.000Z
tags: ["concurrency","locking","Databases","two-phase-locking","concurrency-control"]
draft: false
canonicalUrl: "https://samuelsorial.com/pessimistic-concurrency-control-2pl/"
---
<h2 id="heading-introduction">Introduction</h2>
<p>In today's high-traffic database management systems (DBMS), leveraging the full potential of hardware is essential. With the advent of modern CPUs, the opportunity for parallel processing has increased significantly. However, executing multiple transactions simultaneously can result in data inconsistencies without proper concurrency control. This is why implementing effective concurrency control is crucial in ensuring the accuracy and reliability of data in a multi-user environment.</p>
<p>A practical method for concurrency control in database management systems is to adopt a pessimistic approach. This approach assumes that conflicts will occur frequently when multiple transactions run simultaneously, and therefore requires transactions to obtain locks on shared data before accessing or modifying it. The system can ensure that data consistency and integrity are maintained, even in a high-traffic environment.</p>
<h2 id="heading-two-phase-locking">Two-Phase Locking</h2>
<h2 id="heading-why">Why?</h2>
<p>Using locks doesn't guarantee the <a target="_blank" href="https://en.wikipedia.org/wiki/Serializability">serializability</a> of transactions, consider this example:</p>
<pre><code class="lang-sql">T1             | T2
<span class="hljs-keyword">BEGIN</span>          |            
X-<span class="hljs-keyword">LOCK</span>(A)      |            
R(A)           |
W(A)           |             
<span class="hljs-keyword">UNLOCK</span>(A)      |             
               | <span class="hljs-keyword">BEGIN</span>
               | X-<span class="hljs-keyword">LOCK</span>(A)
               | W(A)
               | <span class="hljs-keyword">UNLOCK</span>(A)
S-<span class="hljs-keyword">LOCK</span>(A)      |
R(A)           |
<span class="hljs-keyword">UNLOCK</span>(A)      |
<span class="hljs-keyword">COMMIT</span>         | <span class="hljs-keyword">COMMIT</span>
</code></pre>
<p><em>Note:</em> X-LOCK() means exclusive lock, used for writes, and S-LOCK() means shared lock, used for reading without blocking other transactions reading at the same time.</p>
<p>As we can see, using locks doesn't prevent T1 from reading a dirty value for A, as T2 didn't commit before the second R(A) in T1, so we exposed a value that wouldn't have been if we run in serializable order.</p>
<p>Also, using locks in a random way can increase the chances of having a <a href="/deadlock-prevention-and-necessary-conditions-to-occur/">deadlock</a> in the system.</p>
<h2 id="heading-how">How?</h2>
<p>It's not surprising to know that Two-Phase locking is constructed by two phases:</p>
<h3 id="heading-phase-1-growing">Phase 1: Growing</h3>
<p>In this phase, the transaction is allowed to request the locks that it needs from the DBMS lock manager, it either gets the lock or gets a denial and waits for the lock to be granted</p>
<h3 id="heading-phase-2-shrinking">Phase 2: Shrinking</h3>
<p>In this phase, the transaction is only allowed to release locks that it already owns, it's not allowed to request any new lock.</p>
<p><img src="/images/posts/ba727968-07ac-453e-bf88-0d04f4af2ec2.png" alt class="image--center mx-auto" /></p>
<p><img src="/images/posts/6da34522-032a-4866-8e7f-8ccbd5f0450e.png" alt class="image--center mx-auto" /></p>
<p>Let's discuss the same example but with 2PL applied:</p>
<p><img src="/images/posts/9bb2b543-578a-480e-bb4b-6d9481e9380e.png" alt class="image--center mx-auto" /></p>
<p>The major difference is that we didn't release the lock for A, and then request it again, as this violates the 2PL. By keeping the lock, we prevented T2 from getting a dirty read that has not been committed yet!</p>
<p>By obeying 2PL, we guarantee generating conflict serializable schedules, as the <a target="_blank" href="https://en.wikipedia.org/wiki/Precedence_graph">precedence graph</a> of those schedules is acyclic. However, we introduced a new problem called cascading aborts. Transaction T2 may read a value that T1 changed previously, but then T1 aborts, which requires the DBMS to abort T2 as it got a value that should not have leaked outside.</p>
<p><img src="/images/posts/81e7d913-f2e1-47de-998b-8131aa746792.png" alt class="image--center mx-auto" /></p>
<p>To solve this issue, we can use another variation of 2PL that requires releasing the locks only at the end of the transaction. This limits the concurrency for sure, but guarantees there are no dirty reads/ cascading aborts.</p>
<p><img src="/images/posts/ddcf1661-946e-49f7-9016-6ac98477f45f.png" alt class="image--center mx-auto" /></p>
<h2 id="heading-lock-hierarchy">Lock Hierarchy</h2>
<h2 id="heading-why-1">Why?</h2>
<p>In the previous examples, we assumed that we are locking each tuple with a single lock, however, this is not efficient in real-world, because sometimes we want to lock the whole table.</p>
<p>Assume we are running a transaction to update the whole bank accounts to get 10% interest each year, it would be like this:</p>
<pre><code class="lang-sql">
<span class="hljs-keyword">BEGIN</span> <span class="hljs-keyword">TRANSACTION</span>;
<span class="hljs-keyword">SELECT</span> * <span class="hljs-keyword">FROM</span> Accounts;
<span class="hljs-keyword">UPDATE</span> Accounts <span class="hljs-keyword">SET</span> balance = balance * <span class="hljs-number">1.1</span>
<span class="hljs-keyword">COMMIT</span>;
</code></pre>
<p>If we have 1 billion rows, we are going to request 1 billion locks for this query will pollute the DBMS lock manager with a huge amount of wasted memory.</p>
<h2 id="heading-how-1">How?</h2>
<p>Locks are organized in a tree-like structure, where each node represents a database object, and the parent node represents a higher level of granularity than its children. For example, the root node of the lock hierarchy could represent an entire database, while its children nodes represent individual tables within the database. The children of a table node could represent individual rows within the table.</p>
<p>When a transaction wants to access a database object, it must first acquire a lock at the appropriate level of granularity. For example, if a transaction wants to update a row in a table, it must first acquire a lock on the table. If another transaction wants to update a different row in the same table, it must also acquire a lock on the table.</p>
<p><img src="/images/posts/bfb91e0d-16d9-40e6-abe9-8eb2a4b6292c.png" alt class="image--center mx-auto" /></p>
<p>Using intention locks to allow a higher level nodes to be locked in either shared or exclusive mode, without having to check all the descendent nodes.</p>
<p><img src="/images/posts/5a4232a9-b685-4817-954d-56cc3e6a154f.png" alt class="image--center mx-auto" /></p>
<ul>
<li><p>To get an S or IS lock on a node, the transaction must hold an IS lock on the parent node.</p>
</li>
<li><p>To get an X, IX, or SIX on a node, the transaction must hold an IX lock on the parent node.</p>
</li>
</ul>
<p>Example:</p>
<p><img src="/images/posts/151f4916-646c-4622-8df6-4680929e7c4d.png" alt class="image--center mx-auto" /></p>
<p>It is worth noting that usually, it's the mission of the DBMS to maintain those locks, and in rare cases, the developer might need to use explicit locks on the transaction to give hints to the DB to improve performance.</p>
<h2 id="heading-references"><strong>References</strong></h2>
<ul>
<li><p>CMU15-445/645 Database Systems lecture notes. Retrieved from: <a target="_blank" href="http://15445.courses.cs.cmu.edu/fall2019"><strong>15445.courses.cs.cmu.edu/fall2019</strong></a></p>
<p>  Note: ChatGPT was used to help me refine and make this post more concise, and readable, and provided some examples. So huge thanks to <a target="_blank" href="https://openai.com/"><strong>OpenAI</strong></a>!</p>
</li>
</ul>
