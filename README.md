# Demo of issue with extra queries since v2.18.23

STR.
1. npm i
2. npm run bug-all
-- or --
2. npm run start
3. (in separate shell) npm run bug

ER.
Normal queries are executed on each update

AR.
After several iterations number of queries run (and execution time)
 starts to increase dramatically. For me, it takes about 6 iterations.
