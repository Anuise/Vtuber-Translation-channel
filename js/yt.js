var key = "AIzaSyAKm8gRfQ7BwSWBtsjiyj3sdFA-lB2ajw8";

// 取得channelID
function get_channelID(){
    var allchannelURL = Array.from(
        new Set([
            "https://www.youtube.com/channel/UC1BeDn15hlon1aZsICIALDg",
            "https://www.youtube.com/channel/UCOQ4zBmhlOghD3R4ibXKzFg",
            "https://www.youtube.com/channel/UCMoiXonpPXRuGJ1I7CiZoqQ",
            "https://www.youtube.com/channel/UChkjxows2O1uQjDrM-lIYsA",
            "https://www.youtube.com/channel/UCVCDYMzbhaelFlkXuRNPBaQ",
            "https://www.youtube.com/channel/UCt1oO-nIiH4sW5_7b3ov3jQ",
            "https://www.youtube.com/channel/UCXeojxOv2Tn-Pkbh8-2smxQ",
            "https://www.youtube.com/channel/UCiW0gDKmaOaMtpMWBi6VphQ",
            "https://www.youtube.com/channel/UC-S9cKN-ETLjOdl4cnv3khQ",
            "https://www.youtube.com/channel/UCu-t8f0OR1vyNsUH_GmkkQA",
            "https://www.youtube.com/channel/UCv37EpdMUsFSsPzkJf2Uztw",
            "https://www.youtube.com/channel/UC3YwnpJzI4AKZllupxL6U8Q",
            "https://www.youtube.com/channel/UCS8wGLjQbEGB0SgPHB269Vg",
            "https://www.youtube.com/channel/UCcMChZW3K6UXY8Ki4PB-xDg",
            "https://www.youtube.com/channel/UCCU6gEE7LycK86U-6aXu0mg",
            "https://www.youtube.com/channel/UCclCFkRwSHIStShm_V39WIA",
            "https://www.youtube.com/channel/UC-93viiNdIdsy0miGanLN3A",
            "https://www.youtube.com/channel/UCHiRA1T9BBStyiq0o8B7Jpw",
            "https://www.youtube.com/channel/UCRgPczu_OO_Te1U7ruq28EQ",
            "https://www.youtube.com/channel/UC4BnzQQSK0OfxNTXDTxzpAQ",
            "https://www.youtube.com/channel/UCsX6hVQAABvK6s6aeeUPwHg",
            "https://www.youtube.com/channel/UCs7eKjlv6al1jYPkOxLRTLQ",
            "https://www.youtube.com/channel/UCqvfN_OusWhWvTXNRwLnA_w",
            "https://www.youtube.com/channel/UCQAZZJ5_2HhaVz79qpf8K2Q",
            "https://www.youtube.com/channel/UCfpIuaewZtYnQjvltAkr2Tw",
            "https://www.youtube.com/channel/UCbL6VwQAM6OCSiI0Ea8-4pA",
            "https://www.youtube.com/channel/UCHg8j6tDSA1riKvmamvzkXw",
            "https://www.youtube.com/channel/UC_YQhsPE3L7VcLdd_JJPH3w",
            "https://www.youtube.com/channel/UCfo4gWoLMHgMOHEGFEFK6gQ",
            "https://www.youtube.com/channel/UCpbifxvX-th66MEHSeGXzNA"
        ])
    )
    // console.log(allchannellist.length);
  
    // 整理排序取出尾段ID
    var channelURL;
    var channelIDlist = [];
    for(channelURL of allchannelURL){
        channelIDlist.push(channelURL.replace("https://www.youtube.com/channel/",""));
    }
    // console.log(channelIDlist);
    return channelIDlist;
}

// 製作channelapi
function get_channelapi(part, id, key){
    var channelAPIlist = [];
    var url;
    for (url of id){
        channelAPIlist.push(
            "https://youtube.googleapis.com/youtube/v3/channels" +
            "?part=" + part +
            "&id=" + url +
            "&key=" + key
        )
    }
    return channelAPIlist;
}

// 取得播放清單ID
async function get_playlistID(url){
    var playlistIDlist = [];
    var api;
    for(api of url){
        var apifetch = await fetch(api);
        var apiresponse = await apifetch.json();
        playlistIDlist.push(apiresponse.items[0].contentDetails.relatedPlaylists.uploads);
    }
    // console.log(playlistIDlist);
    return playlistIDlist;
}

// 製作playlistapi
function get_playlistAPI(part, id, key, max){
    var playlistAPIlist = [];
    var url;
    for(url of id){
        playlistAPIlist.push(
            "https://www.googleapis.com/youtube/v3/playlistItems" +
            "?part=" + part +
            "&playlistId=" + url +
            "&key=" + key + 
            "&maxResults=" + max
        )
    }
    return playlistAPIlist;
}

// 獲取所有頻道前X個影片ID
async function get_videoDetail(url){
    var videoDetail = [];
    var api;
    for(api of url){
        var apifetch = await fetch(api);
        var apiresponse = await apifetch.json();
        var item = apiresponse.items;
        var itemdata;
        for(itemdata of item){
            var publishedAt_contentDetails = itemdata.contentDetails.videoPublishedAt;
            var publishedAt_snippet = itemdata.snippet.publishedAt;
            // videoDetail.push(itemdata.contentDetails);
            if(publishedAt_contentDetails >= publishedAt_snippet){
                videoDetail.push(itemdata.contentDetails);
            }
        }
    }
    videoDetail.sort(function(a, b){
        return a.videoPublishedAt < b.videoPublishedAt ? 1 : -1;
    })
    return videoDetail;
}

var channelIDlist = get_channelID();
// console.log(channelIDlist);
var channelAPIlist = get_channelapi(part="contentDetails", id=channelIDlist, key=key);
// console.log(channelAPIlist);
var playlistIDlist = Promise.resolve(get_playlistID(url=channelAPIlist));
// console.log(playlistIDlist);
var playlistAPIlist = playlistIDlist.then (function(id){
    // console.log(id);
    return get_playlistAPI(part="snippet,contentDetails", id=id, key=key, max=2);
})
// console.log(playlistAPIlist);
var videoDetaillist = playlistAPIlist.then (function(url){
    return get_videoDetail(url);
})
// console.log(videoDetaillist);
var videoDetail;
videoDetaillist.then (function(videoDetaillist){
    for (videoDetail of videoDetaillist){
        var video = document.createElement("iframe");
        video.src = "https://www.youtube.com/embed/" + videoDetail["videoId"];
        video.style.width = "20vw";
        video.style.height = "20vh";
        video.style.padding = "10px"
        document.getElementById("main_content").appendChild(video);
    }
})
