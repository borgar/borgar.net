Title: Forritunargátan
Slug: forritunargatan
Date: 2005-05-24 11:55:25
Lang: is
Tags: code, php, programming, snippet

Það var lögð fyrir mig forritunargáta áðan sem er svona:

    if (substr($fjoldi, strlen($fjoldi) - 1, 1) == 1
        && substr($fjoldi, strlen($fjoldi) - 2, 1) != 1)

*Hvað gerir þetta og í hvað er það notað?*

Svarið er sennilega ekki augljóst.  Það var það þó fyrir mig vegna þess að ég hef gert þetta áður. Þetta athugar hvort að síðusta stafurinn í tölu sé 1 og hvort að næst síðasti stafurinn sé það ekki.

Þetta er notað til þess að athuga hvort að orð eru í fleirtölu í íslensku. Töluorð sem enda á 1 stýra eintölu nema ef þau enda á 11, þá krefjast þau fleirtölu.

Eina vandamálið er að þessi kóði virkar ekki. Hann klikkar ef hann fær töluna 1 inn.

Vandamálið er undarleg hegðun í PHP sem veldur því að ef byrjunin á streng sem á að klippa úr öðrum lendir fram fyrir byrjun strengsins þá virðist vera talið frá fyrsta staf.

    return substr("test", -16, 1) // skilar "t".

Það er svosem hægt að komast hjá þessu vandamáli með því að skella t.d. bili framan á strenginn áður en hann er metinn, en það er ekki alvöru lausn.

Mér finnst besta leiðin til þess að gera þetta vera reikniaðferð. Þá er þetta gert svona:

    function is_plural($val) {
      return (($val-1) % 10) && (($val-11) % 100);
    }

Verði ykkur að góðu.

### Uppfært: 22. Maí 2006:

Ég lagaði bæði færsluna og einfaldaði kóðann örlítið. Það má einnig skrifa þetta svona:

    function is_plural($val) {
      return !(($val % 10) == 1) && (($val % 100) !== 11);
    }

Það verður örlítið lengri kóði í PHP, en í öðrum forritunarmálum gæti þetta verið styttra.