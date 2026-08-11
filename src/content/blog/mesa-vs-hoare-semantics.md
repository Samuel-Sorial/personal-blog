---
title: "Mesa VS Hoare semantics"
description: "Introduction\nWhile designing multithreaded programs, we need to keep sure that our shared objects are synchronized between all of the running threads. Monitors are used to ensuring this synchronization. A monitor provides the programmer with the abil…"
publishDate: 2021-01-13T01:04:05.000Z
tags: ["operating system","concurrency","multithreading"]
draft: false
canonicalUrl: "https://samuel-sorial.hashnode.dev/mesa-vs-hoare-semantics"
---
<h3 id="heading-introduction">Introduction</h3>
<p>While designing multithreaded programs, we need to keep sure that our shared objects are synchronized between all of the running threads. Monitors are used to ensuring this synchronization. A monitor provides the programmer with the ability to lock or wait for a lock to edit/view the shared data.</p>
<p>Mutex lock is a type of lock that only allows one thread to access the data or edit it. Although using mutex locks prevent the unpredicted result of race conditions, it's not enough to build efficiently synchronized data. We need to use condition variables like wait, signal to know when a shared state is updated. Using wait allows the thread to release the lock, and wait until another thread signals it to run again. </p>
<h3 id="heading-ive-called-wait-what-will-happen">I've called wait, what will happen?</h3>
<p>After calling wait, the scheduler puts the thread on the waiting queue of this condition variable. When any other thread calls a signal one waiting thread will run again. Although we have waited, and another thread called signal, we can not guarantee that the state we are waiting for is correct. Suppose that we are writing a queue that is used in a multithreaded application, a pseudo-code for remove function could be:</p>
<pre><code><span class="hljs-keyword">void</span> remove() {
  lock.acquire()
  <span class="hljs-keyword">if</span>(queue.length == <span class="hljs-number">0</span>){
      wait(lock)
     }
  <span class="hljs-comment">// code that does the actual remove</span>
  lock.release()
}
</code></pre><p>The main problem with the code above is that we are assuming that when the thread is back after the wait, the queue length won't be 0! </p>
<h3 id="heading-mesa-semantics">Mesa semantics</h3>
<p>Mesa (a programming language that was implemented by Xerox) proposes that when a signal call is made, a thread will be taken out from the waiting queue, and will be put on the ready queue. However, this doesn't mean that the thread will run immediately. The scheduler can choose when to run this thread, which means that another thread could have run and changed the state of the object! Mesa semantics are widely used, thus we should change our implementation to:</p>
<pre><code>  <span class="hljs-keyword">while</span>(queue.length == <span class="hljs-number">0</span>){
      wait(lock)
     }
</code></pre><p>By changing the if statement to while, we are sure that the queue length is not 0 if we left the while loop. Some programming languages take this idea more extreme, as an example, Java condition variables allow something called "spurious wakeups". </p>
<blockquote>
<p>When waiting upon a Condition, a “spurious wakeup” is permitted to occur, in
general, as a concession to the underlying platform semantics. This has a little
practical impact on most application programs as a Condition should always be
waited upon in a loop, testing the state predicate that is being waited for. An
implementation is free to remove the possibility of spurious wakeups but it is
recommended that applications programmers always assume that they can
occur and so always wait in a loop.  <a target="_blank" href="https://docs.oracle.com/javase/8/docs/api/">Java Documentation</a>  </p>
</blockquote>
<h3 id="heading-hoare-semantics">Hoare semantics</h3>
<p> <a target="_blank" href="https://en.wikipedia.org/wiki/Tony_Hoare">Tony Hoare</a> proposed a different approach to signaling threads. When a thread calls signal, the scheduler stops the currently running thread, and immediately transfer the execution to one of the waiting threads. The signal call here is atomic because there's no change in the state between the signal and the wake-up. It may seem better to use Hoare semantics, however, this semantics proposes different complexities on building the condition variables themselves. Thus, most of the libraries implement Mesa semantics. </p>
