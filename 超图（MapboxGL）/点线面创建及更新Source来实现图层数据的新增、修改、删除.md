# 点线面创建及更新Source来实现图层数据的新增、修改、删除

* 根据多类型的GeoJSON数据(含Point Polygon LineString)创建

```
//多类型的数据含Point Polygon LineString
        let geojson = {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "properties": {
                    "name": "天府三街"
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [104.06303023033792, 30.54675753000589]
                }
                },
                {
                  "type": "Feature",
                  "properties": {
                      "name": "天府五街"
                  },
                  "geometry": {
                      "type": "Point",
                      "coordinates": [104.06056505865428, 30.537889923501893]
                  }
                },
                {
                  "type": "Feature",
                  "properties": {
                      "name": "银泰城"
                  },
                  "geometry": {
                      "coordinates": [[[104.05734538204854, 30.542126961366336], [104.05733923297134, 30.540628203046936], [104.06044451507631, 30.540659979072146], [104.06041991880102, 30.542142849135033], [104.05734538204854, 30.542126961366336]]],
                      "type": "Polygon"
                  }
                },
                {
                  "type": "Feature",
                  "geometry": {
                      "type": "LineString",
                      "properties": { "name": "天府大道" },
                      "coordinates": [
                          [104.06913702979529, 30.546739585129146],
                          [104.06907454389955, 30.54592791405807],
                          [104.06912588372228, 30.544417223111353],
                          [104.06914299695103, 30.542508560460377]
                      ]
                  }
                }
            ]
        }

        map.addSource('geodata', { type: 'geojson', data: geojson })
        map.addLayer({
                "id": "polygonlayer",
                "type": "fill",
                "source": "geodata",
                "paint": {
                    "fill-color": "red",
                    "fill-opacity": 0.4
                },
                "filter": ["==", "$type", "Polygon"]
            })
 
            map.addLayer({
                'id': 'pointlayer',
                'type': 'circle',
                'source': "geodata",
                "filter": ["==", "$type", "Point"],
                'paint': {
                    // make circles larger as the user zooms from z12 to z22
                    'circle-radius': {
                        'base': 1.75,
                        'stops': [[12, 2], [22, 180]]
                    },
                    "circle-color": "#B42222"
                }
            })

            map.addLayer({
                'id': 'linelayer',
                'type': 'line',
                'source': "geodata",
                "filter": ["==", "$type", "LineString"],
                "layout": {
                    "line-join": "round",
                    "line-cap": "round"
                },
                "paint": {
                    "line-color": "#BF93E4",
                    "line-width": 5
                }
            })
```

* 通过操作mapboxgl中GeoJSON的数据，更新Source来实现图层数据的新增、修改、删除

```
map.getSource('name').setData(newData)
```