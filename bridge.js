const PORT = 8000
var paths = []
var finalArray = []
console.log(localStorage.getItem('reversed'))
var reversed = (/true/).test(localStorage.getItem('reversed')) || false
localStorage.setItem('reversed', reversed)
var ready = false
function addPlaylist(){
    //console.log(document.getElementById('div-inp').files[0])
try {
    var path = document.getElementById('div-inp').files[0].path.split('\\')
    path = path.filter(el => el !== path[path.length - 1] )
    var link = ''
    path.forEach((segm) => {
        link += segm + '\\'
    })
    //console.log(link)
    fetch(`http://localhost:${PORT}/addPL?METADATA=${JSON.stringify(link)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then((res) => {
        switch(res.status){
            case 204: {
                try {
                    var filtered = FilterArray(document.getElementById('current-track').childNodes);    
                    document.getElementById('current-track').childNodes.forEach((elem) => {
                        if(elem.id === 'child-track'){
                            elem.style.opacity = '0%'
                            setTimeout(() => {
                                document.getElementById('current-track').removeChild(elem)
                            }, 500)
                        }
                    
                        filtered.forEach((elem) => {
                            document.getElementById('current-track').appendChild(elem)
                        })
                    })
                } catch (e) {
                    console.error('could not filter array', e)
                }
                fetchPlaylist().then((data) => {
                    console.log(data)
                    if(data === 'nothing'){
                        console.log('Nothing')
                    }
                    else{
                    try{ManageData(data)}
                    catch(e){console.error(e)}}
                })
                .catch((e) => console.error(e))
                console.log('err2')
                document.getElementById('div-selector').style.opacity = '80%'
                document.getElementById('no-div-err').style.opacity = '0%'
                document.getElementById('div-set-filter').style.opacity = '30%'
                //paths.push(path)
            }break;
    
            case 207: {
                displayERR()
                console.log('Already exists')
            }break;

            case 206: {
                console.log('Nothing')
            }break;
    
        }
    })
    .catch((e) => console.error(e))
    
} catch (e) {
    console.log(e)
}
document.getElementById('div-inp').value = null
}

async function deletePLCache(){
    console.log('deleting')
    //console.log(document.getElementById('div-selector').childNodes)
    if(document.getElementById('div-selector').childNodes.length > 1){
    
    var PLnodes = document.getElementById('div-selector').childNodes;
    
    PLnodes.forEach((elem) => {
        if(elem.nodeName !== '#text'){
            elem.style.opacity = '0%'
            setTimeout(() => {
                document.getElementById('div-selector').removeChild(elem)
            }, 500)
        }
    })
    
}

if(document.getElementById('current-track').childNodes.length > 1){
    var listnodes = document.getElementById('current-track').childNodes

    listnodes.forEach((elem) => {
        if(elem.id === 'child-track'){
            elem.style.opacity = '0%'
            setTimeout(() => {
                document.getElementById('current-track').removeChild(elem)
            }, 500)
        }
    })

}
    console.log(document.getElementById('div-selector').childNodes)
}

function FilterArray(array){
    const uelem = new Set();

    array.forEach(item => {
    if (!uelem.has(item.id)) {
        uelem.add(item);
    }
    });

    return Array.from(uelem);
}

function deldiv(nbr, link){
    //console.log(link)
    fetch(`http://localhost:8000/delPath?link=${link}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then((res) => {
        switch(res.status){
            case 201:{
                document.getElementById(`child-div-${nbr}`).style.opacity = '0%'
                setTimeout(() => {
                    document.getElementById(`child-div-${nbr}`).remove()
                    document.getElementById('Refresh').click()
                }, 500)
            }break;

            case 206:{
                console.log('failed to delete')
            }break;

            case 205:{
                document.getElementById(`child-div-${nbr}`).style.opacity = '0%'
                setTimeout(() => {
                    document.getElementById(`child-div-${nbr}`).remove()
                    //console.log('err3')
                    document.getElementById('no-div-err').style.opacity = '80%'
                    document.getElementById('div-set-filter').style.opacity = '0%'
                    document.getElementById('div-selector').style.opacity = '0%'
                    document.getElementById('Refresh').click()
                }, 500)
            }break;
        }
    })
    .catch((e) => console.error(e))
}

function getFullDataNode(raw){

    const main = document.createElement('div')
    main.className = 'child-track'
    main.id = 'child-track'
    main.style.position = 'absolute'
    main.style.width = '100%'
    main.style.height = '110px'
    const imgparent = document.createElement('i');
    const img = document.createElement('img'); img.src = raw.image || './Addons/icons/help.png'; img.style.maxWidth = '110px'; img.style.maxHeight = '110px'; img.style.height = '110px'; img.style.position = 'absolute'; img.style.left = '0'; img.style.transition = 'all 1s ease-out'; img.style.filter = 'invert(30%)'; img.style.borderRadius = '5px'; 
    imgparent.appendChild(img);
    
    const info = document.createElement('div'); info.style.position = 'absolute'; info.style.left = '130px'; info.style.top = '0'; info.style.width = '70%'; info.style.height = '110px'; info.style.overflow = 'hidden'; 
    const title = document.createElement('h3'); title.style.fontFamily = 'PS, sans-serif'; title.style.position = 'absolute'; title.style.overflow = 'hidden'; title.style.textOverflow = 'ellipsis'; title.style.whiteSpace = 'nowrap'; title.style.width = '100%';
    title.style.top = '15px'; title.style.left = '20px'; title.style.color = 'white'; title.style.fontSize = '25px'; title.style.filter = 'invert(30%)'; title.style.transition = 'all 1s ease-out'; title.innerHTML = raw.title || 'Unknown';
    const artist = document.createElement('h3'); artist.style.fontFamily = 'PS, sans-serif'; artist.style.position = 'absolute'; artist.style.top = '50px'; artist.style.left = '20px'; artist.style.color = 'white'; artist.style.fontSize = '15px'; artist.style.filter = 'invert(60%)'; artist.style.transition = 'all 1s ease-out'; artist.innerHTML = raw.artist || 'Unknown';
    const album = document.createElement('h3');
    album.style.fontFamily = 'PS, sans-serif'; album.style.position = 'absolute'; album.style.top = '80px'; album.style.left = '20px'; album.style.color = 'white'; album.style.fontSize = '15px'; album.style.filter = 'invert(60%)'; album.style.transition = 'all 1s ease-out'; album.innerHTML = raw.album || 'Unknown';

    info.appendChild(title); info.appendChild(artist); info.appendChild(album);
    main.appendChild(info)
    main.appendChild(imgparent)

    return main
}

function ManageData(data){
    console.log(data[0])
    //console.log(data)
    if(data[1].length > 0){
        var iter = 0
        data[1].forEach((link) => { 
            iter++
            var Path = link.split('\\')
            const tempPath = link
            
            const choicetxt = document.createElement('h2')
            choicetxt.style.fontFamily = 'PS, sans-serif'
            choicetxt.style.position = 'absolute'
            choicetxt.style.marginTop = `${iter*5}px`
            choicetxt.style.left = '20px'
            choicetxt.innerHTML = Path[Path.length - 2] + '\\'

            const span = document.createElement('span')
            span.style.fontFamily = 'PS, sans-serif'
            span.style.color = 'rgb(139, 24, 24)'
            span.innerHTML = Path[Path.length - 1]

            choicetxt.appendChild(span)
    
            const choicebtn = document.createElement('i')
            choicebtn.style.position = 'absolute'
            choicebtn.classList.add('div-btn')
            choicebtn.style.marginTop = `${iter*5}px`
            choicebtn.style.right = '20px'
            choicebtn.style.height = 'fit-content'
            choicebtn.style.width = 'fit-content'

            const delicon = document.createElement('img')
            delicon.src = './Addons/icons/delete.png'
            const tempcount = iter
            delicon.onclick = () => {deldiv(tempcount, tempPath)}
            delicon.style.height = '30px'

            choicebtn.appendChild(delicon)
    
            const div = document.createElement('div')
            div.id = `child-div-${tempcount}`
            div.style.transition = 'all .5s ease-out'
            div.className = 'child-div'
            div.style.marginTop = '15px'
            div.style.marginBottom = '50px'
            div.style.height = '40px'
            div.style.width = '100%'
    
            div.appendChild(choicetxt)
            div.appendChild(choicebtn)
    
            document.getElementById('div-selector').appendChild(div)

        })
        var altiter = 0
        data[0].forEach((elem) => {
            altiter++
            const child = getFullDataNode(elem)
            //console.log(child)

            if(!reversed){
            child.style.top = 430 - 150*altiter + 'px'}
            else {
                child.style.top = 140 + 150*altiter + 'px'}
            document.getElementById('current-track').appendChild(child)
            setTimeout(() => {
                ready = true
            }, 100)
        })
    } else{
        console.log('err1')
        document.getElementById('no-div-err').style.opacity = '80%'
        document.getElementById('div-set-filter').style.opacity = '0%'
        document.getElementById('div-selector').style.opacity = '0%'
    }
}

async function fetchPlaylist(){
    const data = await fetch(`http://localhost:${PORT}/ParseLinks`)
    if(data.status === 209){
        return 'nothing'
    }
        return await data.json()
}

function getMetadataDB(element){
    const url = `https://theaudiodb.com/api/v1/json/DAAEB/searchtrack.php?s=coldplay&t=yellow`
    fetch(url)
    .then((res) => {console.log(res); res.json()})
    .then((mes) => {console.log(mes)})
    .catch((e) => console.error(e))

}
