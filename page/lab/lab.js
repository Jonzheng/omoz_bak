
Page({

  data: {
      doo:"animate",
      act:false
  },
  onclick:function(e){
      this.setData({
          act:!this.data.act
      })
  }
})