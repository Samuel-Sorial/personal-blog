---
title: "Quorum Consensus"
description: "The Problem\nAccording to the CAP theorem, you can not achieve consistency, availability, and partition tolerance all at once. However, achieving strong consistency is desirable in many systems, but this strong consistency has a price that should be p…"
publishDate: 2021-03-06T15:00:26.000Z
tags: ["operating system","distributed system"]
draft: false
canonicalUrl: "https://samuelsorial.com/quorum-consensus"
---
<h2 id="heading-the-problem">The Problem</h2>
<p>According to the CAP theorem, you can not achieve consistency, availability, and partition tolerance all at once. However, achieving strong consistency is desirable in many systems, but this strong consistency has a price that should be paid.
One naive implementation of strong consistency asks the master to serialize all of the operations, which makes it a bottleneck of the system. Although there are many other kinds of consistency that might be suitable for your system, many systems still need strong consistency. That's why it's important to optimize it as much as possible.</p>
<h3 id="heading-pigeonhole-principle">Pigeonhole Principle</h3>
<p>Before digging into the optimization, there is an important mathematical (probabilistic) topic that needs to be understood. As it's the base for the solution. Assume that you have n items, and m containers, where n &gt; m. However, you need to put all of these n items inside these m containers. What can you deduce from this information? Right, that there is at least one container that will have more than 1 item inside it! That's because n - m &gt; 0,</p>
<p><img src="/images/posts/OIowUq_j8.png" alt="FJTq98kIJ.png" /></p>
<h3 id="heading-quorum-consensus">Quorum Consensus</h3>
<p>Let's improve our insert, get operations performance.</p>
<ul>
<li>Define a replica set of size N</li>
<li>put() only succeed if the master received at least acks from W replicas</li>
<li>get() only succeed if the master got acks from R replicas</li>
<li>W + R &gt; N </li>
</ul>
<p>Just think about it, it's a direct application of the pigeonhole principle. When we update, we get W acks, when we retrieve, we get R acks, W + R - N &gt; 0 which means that there should be at least one replica that got the update, and that voted in the retrieve.</p>
<h4 id="heading-example">Example</h4>
<p>Assume we started with N = 3 replicas {N1, N3, N4} , and W = 2 (we require 2 acks for each write operation), and R = 2 (we require 2 acks for each get operation) </p>
<p><img src="/images/posts/ctLTV5YIT.png" alt="image.png" />
When the N3 update operation fails, it doesn't matter because we already have 2 other acks. </p>
<p><img src="/images/posts/vvU5f2Imj.png" alt="image.png" />
When we retrieve, we get 2 acks as required, from N1, N3. Although N3 failed and gave us a null result, N1 had already the update, which means that we achieved our goal with the minimum overhead!</p>
<p>References and further reading:</p>
<ul>
<li>CS162 Operating Systems UC Berkeley lecture notes. Retrieved from:<a target="_blank">https://inst.eecs.berkeley.edu/~cs162/fa13/</a> </li>
<li>A note on quorum consensus. Retrieved from:  <a target="_blank" href="http://web.mit.edu/6.033/2005/wwwdocs/quorum_note.html">http://web.mit.edu/6.033/2005/wwwdocs/quorum_note.html</a> </li>
<li>Wikipedia contributors. (2021, January 11). Quorum (distributed computing). Wikipedia. https://en.wikipedia.org/wiki/Quorum_(distributed_computing)</li>
<li>Pigeonhole principle short video: https://www.youtube.com/watch?v=2-mxYrCNX60&ab_channel=TheTrevTutor</li>
</ul>
