---
title: "Thread Implementation & Modeling"
description: "Threads Implementation\n\nKernel Threads\nKernel threads are the simplest type of threads. They are implemented in the operating system kernel itself. It's used to execute the kernel code concurrently.\n\n\nSingle-threaded processes with multiple kernel th…"
publishDate: 2020-12-31T01:41:40.000Z
tags: ["multithreading","concurrency","operating system"]
draft: false
canonicalUrl: "https://samuelsorial.com/thread-implementation-and-modeling"
---
<h2 id="heading-threads-implementation">Threads Implementation</h2>
<ul>
<li><h3 id="heading-kernel-threads">Kernel Threads</h3>
Kernel threads are the simplest type of threads. They are implemented in the operating system kernel itself. It's used to execute the kernel code concurrently.</li>
</ul>
<ul>
<li><h3 id="heading-single-threaded-processes-with-multiple-kernel-threads">Single-threaded processes with multiple kernel threads</h3>
Each process has only a single thread, however, the kernel has more than one thread, so it can execute different code concurrently. This means that <strong>the kernel can handle multiple system calls</strong> from different processes concurrently.</li>
</ul>
<ul>
<li><h3 id="heading-multi-threaded-processes-with-multiple-kernel-threads">Multi-threaded processes with multiple kernel threads</h3>
Each process can have more than a single thread. This is enabled by the operating system itself by providing a library and system calls to allow processes of having many threads. Unfortunately, this makes <strong>a huge overhead in performance</strong> as we will discuss further.</li>
</ul>
<ul>
<li><h3 id="heading-user-level-threads">User-level threads</h3>
By allowing the processes to have many threads at the user-level, we reduce the overhead of the system calls to the kernel. From the kernel perspective,<strong> each process is a single thread</strong>, and from the user-level perspective, <strong>each process can have many threads</strong>. However, this type of thread has many problems that we will discuss further.</li>
</ul>
<h2 id="heading-multithreading-models">Multithreading Models</h2>
<ul>
<li><h3 id="heading-one-to-one">One-to-One</h3>
In this model, each user-level thread is mapped to a kernel thread. This means that each thread can make system calls without any blocking on the other threads at the same process. Also, it allows us to make the best use of multicore processors. But this creates a huge overhead for the operating system because, at each thread operation, we need to do a system call to the kernel. To prevent processes from overwhelming the operating system with a huge number of system calls to maintain threads, the designers decided to <strong>restrict the number of threads </strong>supported by the OS. This model is used by Linux and Windows.</li>
</ul>
<p><img src="/images/posts/HGM5jv4Gk.png" alt="one-to-one model Retrieved from  [https://cs162.org/](https://cs162.org/) " /></p>
<p>One-to-one model. Retrieved from  <a target="_blank" href="https://cs162.org/">https://cs162.org/</a> </p>
<ul>
<li><h3 id="heading-many-to-one">Many-to-One</h3>
To solve the performance issues from the one-to-one, operating systems designers tried to make many user-level threads share the same kernel thread, which means that if one user-level thread makes a system call, the other user-level threads inside the same process will be stopped. However, this problem can be solved by the <a target="_blank" href="https://en.wikipedia.org/wiki/Scheduler_activations">Scheduler Activations</a>. The main disadvantage of this model is that <strong>we are not making the best use of our multicore processors!</strong></li>
</ul>
<p><img src="/images/posts/Ab9C5wlyC.png" alt="Many-to-one model Retrieved from  [https://cs162.org/](https://cs162.org/) " /></p>
<p>Many-to-one model. Retrieved from  <a target="_blank" href="https://cs162.org/">https://cs162.org/</a> </p>
<ul>
<li><h3 id="heading-many-to-many">Many-to-Many</h3>
Whenever software engineers face a problem, they first give their beloved patterns a try, one of these patterns is pipelining. Why create a kernel thread for each user-level thread, or to create a single kernel thread for all user-level threads, if you can create many kernel threads to represent many user-level threads that <strong> get pipelined into these different kernel threads</strong>. This model solves the previous problems. Whenever a user-level thread makes a system call, the other user-level thread at the same process can continue running, and also don't need to make a system call for each thread operation, as there are many of these operations are implemented in the user-level library. This model is used in Go runtime.</li>
</ul>
<p><img src="/images/posts/RzApHbZqX.png" alt="Many-to-many model Retrieved from  [https://cs162.org/](https://cs162.org/) " /></p>
<p>Many-to-many model. Retrieved from  <a target="_blank" href="https://cs162.org/">https://cs162.org/</a> </p>
<h2 id="heading-references">References:</h2>
<ul>
<li>Anderson, T. E., & Dahlin, M. (2011). Operating systems: Principles and practice. West Lake Hills, TX: Recursive Books.</li>
<li>Silberschatz, A., Galvin, P., & Gagne, G. (2012). Operating System Concepts, 9th Edition. John Wiley & Sons.</li>
</ul>
