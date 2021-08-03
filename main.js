(async()=>{
    const {importAll, getScript} = await import('https://rpgen3.github.io/mylib/export/import.mjs');
    await getScript('https://code.jquery.com/jquery-3.3.1.min.js');
    const $ = window.$;
    const rpgen3 = await importAll([
        'css',
        'util',
        'input',
        'random'
    ].map(v => `https://rpgen3.github.io/mylib/export/${v}.mjs`));
    rpgen3.addCSS('https://onjmin.github.io/pixiv/main.css');
    const html = $('body').empty().css({
        'text-align': 'center',
        padding: '1em',
        'user-select': 'none'
    });
    $('<h1>').appendTo(html).text('Pixivの画像をランダムで表示するだけ');
    const msg = (()=>{
        const elm = $("<div>").appendTo(html);
        return (str, isError) => $("<span>").appendTo(elm.empty()).text(`${str} (${rpgen3.getTime()})`).css({
            color: isError ? 'red' : 'blue',
            backgroundColor: isError ? 'pink' : 'lightblue'
        });
    })();
    const ui = $('<div>').appendTo(html),
          holder = $('<div>').appendTo(html);
    let running = false;
    $('<button>').appendTo(ui).text('探すボタン').on('click', async () => {
        if(running) return;
        running = true;
        msg('画像を探します');
        const [elm, id] = await search();
        holder.empty();
        rpgen3.addInputStr(holder,{
            label: 'url',
            value: 'https://www.pixiv.net/artworks/' + id,
            copy: true
        })
        holder.append(elm);
        msg('画像を見つけた');
        running = false;
    });
    const save = [];
    const search = () => {
        const id = rpgen3.randInt(1, 91703675);
        if(save.includes(id)) return search();
        save.push(id);
        return judge(id).then(elm => [elm, id]).catch(() => search());
    };
    const judge = id => new Promise((resolve, reject) => {
        const elm = $('<img>').prop({
            src: 'https://embed.pixiv.net/decorate.php?illust_id=' + id
        }).on('load', () => resolve(elm)).on('error', reject);
    });
})();
