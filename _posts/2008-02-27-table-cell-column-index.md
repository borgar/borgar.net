Title: What is the column index of a table cell
Slug: table-cell-column-index
Date: 2008-02-27 00:36:25
Lang: en
Tags: javascript, programming

A peculiar but fascinating problem presented itself to me today. It was one of those; "oh yeah, I'd better look at that" kind of problems that you think you'll solve in a few minutes but eventually grow to take hours.

> Given a cell in a HTML table, what is it's column index?

This seems like it's simple. You just count the cells preceding it. Fine. Works for 99% of cases. But what if the table looks like this?:

<table border="1">
<tbody>
<tr>
<td rowspan="4">cell 1</td>
<td>cell 2</td>
<td colspan="2">cell 3</td>
<td rowspan="4">cell 4</td>
<td rowspan="2">cell 5</td>
<td id="last">cell 6</td>
</tr>
<tr>
<td>cell 7</td>
<td rowspan="3">cell 8</td>
<td rowspan="2" id="">cell 9</td>
<td>cell 10</td>
</tr>
<tr>
<td rowspan="2">cell 11</td>
<td>cell 12</td>
<td rowspan="2">cell 13</td>
</tr>
<tr>
<td><strong>My index?</strong></td>
<td>cell 15</td>
</tr>
</tbody>
</table>

Suddenly things are very complicated again. The last row really only contains two cells and the browser reports cell indexes 0 and 1 on those, respectively. Not the 3 and 4 I was hoping for.

My first thought was simply adding up the number of cells preceding this one which had a greater *row index* + *row span* than the *row index* of my subject cell. This doesn't work because of cells like #4 & #13.

Eventually I simply ended up with a brute force method that does the job. But is unfortunately neither fast nor elegant. But then, what code of mine is?

It's presented here in case anyone else needs to solve the same annoying problem. Or if anyone can suggest a nicer (or preferably a faster) method of doing this.

[View demo and code][1].

[1]: /programs/cell-offset/