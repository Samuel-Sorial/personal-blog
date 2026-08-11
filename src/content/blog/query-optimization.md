---
title: "Query Optimization"
description: "Introduction\nSQL is a declarative language, which means that when you request a query, you specify the data you want, but not how to get it. The database management system (DBMS) is responsible for determining the most efficient way to retrieve the r…"
publishDate: 2023-01-16T15:12:56.000Z
tags: ["Databases","query tuning","query-optimization"]
draft: false
canonicalUrl: "https://samuel-sorial.hashnode.dev/query-optimization"
---
<h1 id="heading-introduction">Introduction</h1>
<p>SQL is a declarative language, which means that when you request a query, you specify the data you want, but not how to get it. The database management system (DBMS) is responsible for determining the most efficient way to retrieve the requested data. This separation of concerns allows users to focus on what data they need, while the DBMS can optimize the underlying operations for efficiency and performance.</p>
<p>There are two main approaches to optimizing a query: heuristics and cost-based search.</p>
<p>Heuristics optimization involves using a set of pre-defined rules or patterns to determine the most efficient way to execute a query. These rules are based on common patterns and practices that are effective in many cases, but they may not always produce the most optimal plan.</p>
<p>Cost-based optimization involves using statistical information about the data and the query itself to determine the most efficient execution plan. The DBMS estimates the costs of different potential execution plans and chooses the one with the lowest cost. This approach can be more accurate than heuristics optimization, but it can also be more time-consuming.</p>
<h1 id="heading-heuristics-amp-rules">Heuristics & Rules</h1>
<p>During query optimization, the database management system (DBMS) will attempt to rewrite the original query provided by the user in a more efficient form. This may include removing unnecessary conditions and using the system catalog (a repository of information about the database's structure and contents) to identify more efficient ways to retrieve the requested data.</p>
<p>The DBMS may also use techniques from relational algebra, a set of mathematical operations used to manipulate data stored in a relational database, to identify equivalent expressions that can be used to achieve the same result. This process allows the DBMS to identify multiple ways to execute the same query and choose the most efficient option.</p>
<h3 id="heading-predicate-pushdown">Predicate Pushdown</h3>
<p>Example query</p>
<pre><code class="lang-sql"><span class="hljs-keyword">SELECT</span> s.name, e.cid
<span class="hljs-keyword">FROM</span> student <span class="hljs-keyword">AS</span> s, enrolled <span class="hljs-keyword">AS</span> e
<span class="hljs-keyword">WHERE</span> s.sid = e.sid
<span class="hljs-keyword">AND</span> e.grade = <span class="hljs-string">'A'</span>
</code></pre>
<p>Expression: <strong>π(name,id)(σgrade='A'(student⋈enrolled))</strong></p>
<p>Equivalent to: <strong>π(name, id)(student⋈(σgrade='A'(enrolled)))</strong></p>
<p><img src="/images/posts/3e959aa7-9c73-4da2-b6e8-76c42239ff41.png" alt class="image--center mx-auto" /></p>
<p>If two equivalent expressions can be used to achieve the same result in a query, why might the database management system (DBMS) choose one over the other?</p>
<p>In our case, the second expression filters the record from table e before performing a join, it's more efficient because it reduces the amount of work the join operation needs to do. The DBMS can more efficiently retrieve the desired data by eliminating unnecessary records.</p>
<h3 id="heading-re-order-predicates">Re-order predicates</h3>
<p>It may also be that a specific predicate is more selective than another one, so it's more convenient to push it down before the others.</p>
<h3 id="heading-simplify-complex-predicates">Simplify complex predicates</h3>
<p>As we know, DBMS executes the predicate to every tuple it receives from the scan operator, if the predicate can be optimized to have less CPU and memory usage, then it's a huge win!</p>
<pre><code class="lang-sql"><span class="hljs-keyword">SELECT</span> first_name, last_name, film_id
<span class="hljs-keyword">FROM</span> actor a
<span class="hljs-keyword">JOIN</span> film_actor fa <span class="hljs-keyword">ON</span> a.actor_id = fa.actor_id
<span class="hljs-keyword">WHERE</span> a.actor_id = <span class="hljs-number">1</span>;
</code></pre>
<p>can be re-written into:</p>
<pre><code class="lang-sql"><span class="hljs-keyword">SELECT</span> first_name, last_name, film_id
<span class="hljs-keyword">FROM</span> actor a
<span class="hljs-keyword">JOIN</span> film_actor fa <span class="hljs-keyword">ON</span> fa.actor_id = <span class="hljs-number">1</span>
<span class="hljs-keyword">WHERE</span> a.actor_id = <span class="hljs-number">1</span>;
</code></pre>
<h3 id="heading-projection-pushdown">Projection Pushdown</h3>
<p>When we have a projection, it will be better if we did it before passing data from one operator to another as it reduces the memory used by the query. Thus, reducing I/O too.</p>
<p><img src="/images/posts/108dce9e-bd23-4ab0-8c9c-788c88bcbc90.png" alt class="image--center mx-auto" /></p>
<h3 id="heading-impossible-predicates">Impossible Predicates</h3>
<p>Sometimes applications issue impossible predicates, that are coming from a user playing around with values from the dashboard somewhere. It would be cool if DBMS detected those and didn't spend time executing them.</p>
<pre><code class="lang-sql"><span class="hljs-keyword">SELECT</span> * <span class="hljs-keyword">FROM</span> A <span class="hljs-keyword">WHERE</span> <span class="hljs-number">1</span> = <span class="hljs-number">0</span>;
<span class="hljs-keyword">SELECT</span> * <span class="hljs-keyword">FROM</span> A <span class="hljs-keyword">WHERE</span> <span class="hljs-number">1</span> = <span class="hljs-number">1</span>;
</code></pre>
<h3 id="heading-merging-predicates">Merging Predicates</h3>
<p>Sometimes predicates are overlapped, and merging reduces CPU utilization</p>
<pre><code class="lang-sql"><span class="hljs-keyword">SELECT</span> * <span class="hljs-keyword">FROM</span> A
<span class="hljs-keyword">WHERE</span> val <span class="hljs-keyword">BETWEEN</span> <span class="hljs-number">1</span> <span class="hljs-keyword">AND</span> <span class="hljs-number">100</span>
<span class="hljs-keyword">OR</span> val <span class="hljs-keyword">BETWEEN</span> <span class="hljs-number">50</span> <span class="hljs-keyword">AND</span> <span class="hljs-number">150</span>;
</code></pre>
<p>DBMS decides to merge them into:</p>
<pre><code class="lang-sql"><span class="hljs-keyword">SELECT</span> * <span class="hljs-keyword">FROM</span> A
<span class="hljs-keyword">WHERE</span> val <span class="hljs-keyword">BETWEEN</span> <span class="hljs-number">1</span> <span class="hljs-keyword">AND</span> <span class="hljs-number">150</span>;
</code></pre>
<h1 id="heading-cost-based-search">Cost-based Search</h1>
<p>In this model, DBMS uses actual data from the tables to determine which plan is better. Unlike the previous way, in which we use static rules. This one evaluates multiple query plans and chooses only the one that has the lowest cost.</p>
<p>The main idea here is to store some statistics about each table, and its attributes (indexes also). And use those statistics to determine the best plan.</p>
<h3 id="heading-statistics">Statistics</h3>
<p>For each relation R, DBMS stores: Nr which is the number of the records in R, V(A, R): the number of the distinct values for each attribute A. Using those two values, we can do some good calculations.</p>
<p>Selection cardinality is the average number of records with a value for a given attribute, SC(A, R) = Nr/V(A, R)</p>
<p>Selectivity of a predicate is the fraction of tuples that qualifies for this predicate</p>
<h3 id="heading-assumptions">Assumptions</h3>
<p>There's a trade-off between having accurate cost analysis and storage, if we want to have a high-accuracy model, then we need bigger storage. However, those statistics should be minimal because we are going to use them in every query, so it's crucial to keep them in memory, not on the disk. That's why we assume data is uniform, and collect some statistics assuming it accurately represents the actual data (which is not the case).</p>
<p>We are assuming that there are no data dependencies, which means that no attribute value affects another attribute. In the real world, a specific city would have a specific postal code, so there's a dependency here. However, we are assuming it's not happening in our DB. Some enterprise databases might allow you to define those dependencies, but it's not common.</p>
<h3 id="heading-sampling">Sampling</h3>
<p>Some databases collect samples from real tables to estimate selectivity. Which requires updating the sample when the tables are changed. Another trade-off, we decide to update the samples when only significant changes happen to the table because we don't need to waste too much effort on keeping samples updated. However, we sacrifice keeping samples accurate, but it's acceptable.</p>
<h3 id="heading-query-optimization">Query Optimization</h3>
<p>Since we know how to estimate the cost of the plan, it's time to enumerate different plans for the query and estimate their costs, then decide which one should be executed.</p>
<ul>
<li><p>Single-relation query: pick the best access method, which is one of the sequential scans, binary search (clustered indexes), or index scan.</p>
</li>
<li><p>Multi-relation query: as joins increase, alternative plans grow exponentially.</p>
</li>
</ul>
<p>In general, the algorithm to generate different plans:</p>
<ol>
<li><p>Enumerate relation ordering</p>
<p> <img src="/images/posts/2db7061c-7e89-43ed-b5fb-3112b2ed6ca4.png" alt class="image--center mx-auto" /></p>
<p> <img src="/images/posts/7cf4acca-3579-4669-80c6-74e24726bb7e.png" alt class="image--center mx-auto" /></p>
</li>
<li><p>Enumerate joins algorithm choices</p>
<p> <img src="/images/posts/98259bc0-42bf-4c7c-9c24-24f847be8e62.png" alt class="image--center mx-auto" /></p>
</li>
</ol>
<ol>
<li><p>Enumerate access method choices</p>
<p> <img src="/images/posts/87d44c13-bf6d-41aa-95cd-c3d7f6f4e506.png" alt class="image--center mx-auto" /></p>
</li>
</ol>
<h3 id="heading-nested-sub-queries">Nested Sub-Queries</h3>
<p>There are two different approaches to optimizing nested sub-queries.</p>
<ol>
<li><p>Rewrite the query to de-correlate them.</p>
<p> <img src="/images/posts/4413300a-6b69-41b2-9d6b-d1f06aa9172d.png" alt class="image--center mx-auto" /></p>
</li>
<li><p>Decompose nested queries and store results in a temporary table.</p>
<p> <img src="/images/posts/11652973-e103-46d1-975d-5ed7d4817d53.png" alt class="image--center mx-auto" /></p>
<p> <img src="/images/posts/76c7cfc7-7774-4df0-9503-d557ed09050a.png" alt class="image--center mx-auto" /></p>
<h1 id="heading-references"><strong>References</strong></h1>
<ul>
<li><p>CMU15-445/645 Database Systems lecture notes. Retrieved from: <a target="_blank" href="http://15445.courses.cs.cmu.edu/fall2019"><strong>15445.courses.cs.cmu.edu/fall2019</strong></a></p>
<p>  Note: ChatGPT was used to help me refine and make this post more concise, and readable, and provided some examples. So huge thanks to <a target="_blank" href="https://openai.com/"><strong>OpenAI</strong></a>!</p>
</li>
</ul>
</li>
</ol>
