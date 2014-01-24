NAT.ltie8 = {};

var table = $("<table></table>").addClass("nat_navigation_ltie8").attr("cellpadding", "0").attr("cellspacing", "0");

var tr = $("<tr></tr>");

$(".nat_navigation").first().find("li").each(function(index)
{
    var td = $("<td></td>").html($(this).html());

    if($(this).attr("class") == "nat_navigation__selected")
    {
        td.removeClass().addClass("nat_navigation_ltie8__selected");
    }

    tr.append(td);
});

table.append(tr);
$(".nat_navigation").first().replaceWith(table);



