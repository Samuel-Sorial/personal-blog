---
title: "An introduction to OAuth 2.0"
description: "An introduction to OAuth 2.0, why delegated authorization exists, and how applications securely request limited access to user resources."
publishDate: 2021-01-04T03:25:29.000Z
tags: ["oauth","authentication","Auth","authorization","APIs"]
draft: false
canonicalUrl: "https://samuelsorial.com/an-introduction-to-oauth-20/"
---
<h3 id="first-of-all-why-does-it-exist">First of all, why does it exist?</h3>
<p>OAuth 2.0 was created to make a standard way - protocol - for making users <strong>delegate access</strong> to their resources in a specific application to another application. This is widely used today, whenever you login into an application using Facebook login or Google login, you are using this protocol. </p>
<h3 id="how-its-used">How it's used?</h3>
<p>From the client perspective, there are many different <strong>grant flows</strong> that depend on client implementation and the sensitivity of the data. Some of these flows may be used in the front-end only, and there are flows that must be used on the server-side only. The overview of the whole process is:</p>
<ol>
<li>The client application requests access from the resource owner, which is the user, it gets an access token.</li>
<li>The client sends a request to the resource server using the access token.</li>
<li>The resource server validates the access token from the authorization server.</li>
</ol>
<p><img src="/images/posts/tXrLmtOX4.png" alt="OAuth2.0 Overview. Retrieved from https://www.youtube.com/watch?v=GyCL8AJUhww" />
<em>OAuth2.0 Overview. Retrieved from  <a target="_blank" href="https://www.youtube.com/watch?v=GyCL8AJUhww">Introduction to OAuth 2.0 and OpenID Connect</a> </em></p>
<h3 id="the-main-players">The main players</h3>
<p>To understand how the protocol works, we need to define each part of the protocol:</p>
<ul>
<li><strong>User</strong> who has the resources in a different application.</li>
<li><strong>Client application</strong> that tries to access the data on behalf of the user in order to provide him with better functionality. There are different use cases, to allow him to login using Facebook, or to schedule his tweets, or to do analytics on it.</li>
<li><strong>Authorization server</strong> that authenticates the user and asks him if he wants to let the client application access his resources by specific roles. Also, it validates the access tokens to keep sure that they are correct and have sufficient roles.</li>
<li><strong>Resource server</strong> that gets requests from the client application, checks its access token by asking the authentication server if this token is valid or not. After that, it can do whatever it's asked to do.</li>
</ul>
<h3 id="oauth-terminology">OAuth Terminology</h3>
<p>There are main terms that are used in every OAuth article you will read, or at the official documentation:</p>
<ul>
<li><p><strong>Access token</strong> which is used to access the resource or write a new resource. At every request, the resource server makes sure that the token didn't expire, and that it has the sufficient roles to do what you asked for. </p>
</li>
<li><p><strong>Refresh token</strong> which is used to ask for a new access token after the one that you have is expired. It may seem redundant to have it, however, it can be used as another layer of protection. By having it, the authorization server can make the access tokens expire in a short time, to prevent damage if it was leaked.</p>
</li>
<li><p><strong>Scope</strong> specifies the access roles, in many cases you only want to read data, in other cases, you want to write or delete data. This type of operation should be implemented carefully, as any leak of tokens may lead to huge damage. So, ask for the roles that your application really wants!</p>
</li>
<li><p><strong>Redirect URI</strong> that the authorization server redirects the user to after it has finished its work.</p>
</li>
</ul>
<h3 id="different-grant-flows">Different Grant Flows</h3>
<p>The grant flows, sometimes called communication flows, depend on the type of client application type. There are many different grant flows, however, we are going to discuss the main grant flows:</p>
<ol>
<li><p><strong>Client Credentials Grant</strong>: the client asks the authorization server to get an access token, the authorization server authenticates the user, asks him to allow the client application, and then sends back the access token to the client. The client can then use this access token to make its requests. This is used to provide <strong><em>application-to-application</em></strong> data. Suppose you are developing an application that needs to view the same events for all users. By using google calendar, you can create one calendar and use Google's API for fetching the data about the events from each user. In this case, the calendar resource doesn't belong to a specific user, it belongs to the client application itself.
<img src="/images/posts/DFjRIcCkk.png" alt="Client Credentials Grant Flow. " />
<em>Client Credentials Grant Flow. Retrieved from <a target="_blank" href="https://www.youtube.com/watch?v=GyCL8AJUhww">Introduction to OAuth 2.0 and OpenID Connect</a> </em></p>
</li>
<li><p><strong>Authorization Code Grant</strong>: The client request access, the authorization server does its authentication and authorization, then sends back an authorization code to the specified URI at the client application. After that, the client app uses the authorization code to get an access token alongside a refresh token. It can use this to access resources and to refresh the token after it's expired. This flow is used to get a specific user's data from another application, just like logging in using another app or getting tweets of a specific person. This flow must be used on the <strong><em>server-side</em></strong> of the application because any leak of the refresh token would lead to huge damage.
<img src="/images/posts/WhYILIDQC.png" alt="Authorization Code Grant Flow" />
<em>Authorization Code Grant Flow. Retrieved from <a target="_blank" href="https://www.youtube.com/watch?v=GyCL8AJUhww">Introduction to OAuth 2.0 and OpenID Connect</a> </em></p>
</li>
<li><p><strong>Implicit Grant</strong>: This flow runs on a <strong><em>front-end</em></strong> application. It has the same workflow as the authorization code, however, it gets back the access token directly without the step of authorization code step, it also doesn't get back a refresh token. That's because it's not secured and should be only used for a short time and it's not advised to use it with sensitive data, and you shouldn't use it to do anything more than reading data.
<img src="/images/posts/22xkNDyXD.png" alt="Implicit Grant" /> 
<em>Implicit Grant Flow. Retrieved from <a target="_blank" href="https://www.youtube.com/watch?v=GyCL8AJUhww">Introduction to OAuth 2.0 and OpenID Connect</a> </em></p>
</li>
</ol>
<h3 id="references-and-further-readings">References and Further Readings</h3>
<ul>
<li><em>Authentication and Authorization Flows.</em>  <a target="_blank" href="https://auth0.com/docs/flows">OAuth0 Documentation</a></li>
<li><em>Introduction to OAuth 2.0 and OpenID Connect. P. De Ryck (2018).</em> <a target="_blank" href="https://www.youtube.com/watch?v=GyCL8AJUhww"> Goto conference talk</a></li>
</ul>
