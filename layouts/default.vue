<!-- MIT License

Copyright (c) 2022 Sébastien Chopin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. -->
<template>
  <div class="max-w-2xl px-4 py-10 m-auto bg-white sm:px-8 sm:shadow  ring-gray-200 sm:rounded-lg">
    <main class="max-w-none">
      <slot />
    </main>
  </div>
</template>
<style scoped>
.max-w-2xl {
  max-width: 1280px;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-10 {
  padding-top: 2.5rem;
  padding-bottom: 2.5rem;
}

.m-auto {
  margin-left: auto;
  margin-right: auto;
}

.bg-white {
  background-color: white;
}

/* .sm\:px-8 {
  @media (min-width: 640px) {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

.sm\:shadow {
  @media (min-width: 640px) {
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }
} */

/* .ring-1:focus,
.ring-1:hover {
  border-width: 1px;
  border-style: solid;
} */

.ring-gray-200 {
  --ring-color: #E2E8F0;
  box-shadow: var(--ring-offset-shadow, 0 0 transparent),
    var(--ring-shadow, 0 0 transparent),
    0 0 0 1px var(--ring-color);
}

.sm\:rounded-lg {
  @media (min-width: 640px) {
    border-radius: 0.5rem;
  }
}
</style>
