Title: Kæra þjóðskrá
Slug: thjodskra-islands
Date: 2008-01-12 14:43:33
Lang: is
Tags: computer, national registry, nerd, rant

Í ljósi þess að þið eruð [sekir um óafsakanlegan aumingjagang][1] á stigi sem eingöngu ríkið fær að komast upp með, ætla ég að hjálpa. Ókeypis.

Gagnagrunns skipunin sem þið eruð að leita að er eitthvað á þessa leið:

    ALTER TABLE `thodskra` MODIFY COLUMN `nafn` VARCHAR(250);

Ég legg svo til að þegar þið byggið textaskrárnar sem þið sendið út að þið varpið mannanöfnum yfir í 30 stafi og skaffið þannig bæði nýja rétta skrá og "samhæfða" skrá. Það má gera það einhvern veginn svona:

    nafn ~= /^(S+).*?(S+)$/1 2/;
    nafn ~= /^(.{1,32}).*$/1/;

Þetta er ekki það mikið mál að fólk þurfi yfirleitt að vita af þessu. Þjóðskrá Íslands getur ekki verið að setja landsmönnum reglur um það hvað má nefna börn á þeim forsendum að hún nenni ekki að skrifa svona marga stafi.

Ef þetta er skortur á þekkingu innanhús þá á einfaldlega að hringja í verktaka og fá þetta lagað. Ég mæli með [Miracle][2].

[1]: http://www.mbl.is/mm/folk/frettir/2008/01/12/nennir_ekki_laga_sig_ad_tolvu/ "MBL: frétt um að Þjóðskrá Íslands kunni ekki á tölvur"
[2]: http://miracle.is/