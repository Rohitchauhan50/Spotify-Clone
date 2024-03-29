import { useState, useEffect } from 'react'
import  {useParams}  from 'react-router-dom'
import RelatedSongs from './RelatedSongs'
import  DetailsHeader from '../components/DetailsHeader'
import Loader from '../components/Loader'

function SongDetails({data ,activeSong,handlePlayPauseClick}) {
  const [LyricsData, setLyricsData] = useState(false)
  const [relatedData, setrelatedData] = useState(false);
  const [IsFetchingLyrics, setIsFetchingLyrics] = useState(false);

const {songid} = useParams();
const {id} = useParams();

  const Fetchlyrics = async () => {
    setIsFetchingLyrics(true)

    let headersListLyrics = {
      "Accept": "*/*",
      "X-RapidAPI-Key": "c5c5b07b9emshf9ccbf3f47591ebp1b50e8jsncb9c3c1cb128",
      "X-RapidAPI-Host": "shazam-core7.p.rapidapi.com"
    }
    const url = `https://shazam-core7.p.rapidapi.com/songs/get_details?id=${songid}`
   
    let response = await fetch(url, {
      method: "GET",
      headers: headersListLyrics
    });
    
    var tempData = await response.json()
    setLyricsData(await tempData)
    setIsFetchingLyrics(false)
  }
  
  const FtechRelatedSong = async () => {
    setIsFetchingLyrics(true)
        let headersListrelated = {
          "Accept": "*/*",
          "X-RapidAPI-Key": "5bd2e9a45fmsh64501b1bb6127b9p15b4f5jsn7eb975aae73d",
          "X-RapidAPI-Host": "shazam.p.rapidapi.com"
        }
        const url = `https://shazam.p.rapidapi.com/artists/get-top-songs?id=${id}&l=en-US`
       
        let response = await fetch(url, {
          method: "GET",
          headers: headersListrelated
        });
        
        var tempDataRel = await response.json()
        setrelatedData(await tempDataRel)
        setIsFetchingLyrics(false)
      }

  useEffect(() => {
   Fetchlyrics();
   FtechRelatedSong();
  }, [songid,id])

  if(IsFetchingLyrics){
    return <Loader/>
  }
  
  return (
    <>
    {data.map((Element)=>{
        return <audio id={Element.hub.actions[0].id+""} src={Element.hub.actions[1].uri}></audio>

    })}
    <div className="flex flex-col mt-5 md-0">
        <DetailsHeader
        songData={LyricsData}
        img={ LyricsData !== false?LyricsData.images.background:""}
        title = {LyricsData !== false?LyricsData.title:"Unknown"}
        subtitle = {LyricsData !== false?LyricsData.subtitle:'Unknown'}
        genres = {LyricsData !== false?LyricsData?.genres?.primary:""}
      />
      <div className="mb-10">
      <h2 className="text-white text-3xl font-bold">Lyrics:</h2>
      <div className="mt-5">
        {LyricsData!==false && LyricsData?.sections[1].type === 'LYRICS'
            ? LyricsData?.sections[1]?.text.map((line, i) => (
              <p key={`lyrics-${line}-${i}`} className="text-gray-400 text-base my-1">{line}</p>
            ))
            : (
              <p className="text-gray-400 text-base my-1">Sorry, No lyrics found!</p>
            )}
      </div>
      </div>
      <RelatedSongs
      song={relatedData !== false?relatedData.data:[]}
      activeSong={activeSong}
      artistId={id}
      handlePlayPauseClick={handlePlayPauseClick}
      />
    </div>
    </>
  )
}

export default SongDetails;
