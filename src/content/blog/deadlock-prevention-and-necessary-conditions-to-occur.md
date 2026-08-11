---
title: "Deadlock prevention & necessary conditions to occur"
description: "Deadlock is a state when a set of threads is waiting for an event that can only be raised by a thread(s) from the same set. There are many situations that developers think that it's a deadlock, and it is not. Sometimes it's a  livelock  or it's just …"
publishDate: 2021-01-25T04:34:24.000Z
tags: ["operating system","multithreading"]
draft: false
canonicalUrl: "https://samuel-sorial.hashnode.dev/deadlock-prevention-and-necessary-conditions-to-occur"
---
<p><strong>Deadlock </strong>is a state when a set of threads is waiting for an event that can only be raised by a thread(s) from the same set. There are many situations that developers think that it's a deadlock, and it is not. Sometimes it's a  <a target="_blank" href="https://en.wikibooks.org/wiki/Operating_System_Design/Concurrency/Livelock">livelock </a> or it's just starvation that has nothing to do with deadlocks at all. So, this article will discuss the necessary 4 conditions that must happen together to make a deadlock, and how we can utilize these conditions to prevent it!</p>
<ol>
<li><strong><em>Mutual Exclusion:</em></strong> Each thread locks the resource that it holds and uses it <strong>exclusively</strong>. In other words, there is no way to share the same resource within two different threads at the same time.</li>
<li><strong><em>No preemption:</em></strong> When a thread uses a specific resource, there is no way that another thread preempts that resource from the thread without its acceptance.</li>
<li><strong><em>Hold and wait:</em></strong> At least one thread is holding a lock to a specific resource and it's waiting to acquire the lock for another lock that is currently being used by another thread.</li>
<li><strong><em>Circular wait:</em></strong> That there exists a set {T0, T1, T2} of waiting threads that go in a circular way <strong>T0-&gt; T1 -&gt; T2 -&gt; T0</strong>. T0 is waiting for a resource that is held by T1, T1 waiting for a resource held by T2, T2 waiting for a resource that is held by T0. </li>
</ol>
<p>All of these conditions should be true and all together, that means that if one condition is not true, then it's not a deadlock!</p>
<h3 id="heading-deadlock-prevention">Deadlock Prevention</h3>
<p>we can use these conditions to prevent a deadlock, by assuring that our system won't reach a state that fulfills all 4 conditions.</p>
<ul>
<li><p>Mutual Exclusion: Some actions that don't require a lock should be detected and used without locks, for example, read-only files don't require any locking as they can not be modified, so the content is always the same. However, in many cases, we can not prevent a deadlock by not using mutex locks, as the system won't perform correctly without these locks.</p>
</li>
<li><p>No Preemption: When a thread requests a resource and it can not get it, the system can then take out the resources that are held by this thread, and give them to another requesting thread. This mechanism is used whenever the resources can be easily saved and restored. </p>
</li>
<li><p>Hold and Wait: There are two methods to use this condition as a way to prevent deadlocks. The first is to ask each thread to specify its requirements before execution and by that, we guarantee that there's no hold and wait! However, this can not be achieved in practical applications. The second one is to allow the thread to request access if and only if it doesn't hold any resources.</p>
</li>
</ul>
<ul>
<li>Circular Wait: In real-world solutions to deadlock, preventing circular wait is the most used way. It generally requires the system to check the order of requests of the resources, and find out if the next request will make the wait circular or not. Suppose we have a set of threads {T0, T1} and a set of resources {R0, R1} the order of requests comes like T0 -&gt; R0, T1 -&gt; R1, after that T0 asks to access R1, which will be accepted. However, when T1 asks to access R0, the system detects that this request makes the wait becomes circular, and then it can refuse it.</li>
</ul>
