#!/bin/bash
# Compiles all codecs required by Cast That Popcorn.
# Tested on a vanilla x86-64 AWS t1.micro instance running Ubuntu 12.04 LTS.
# Took 1 hour to completely build and install.
# 
# Before running this make sure you have repo ffmpeg uninstalled, and do:
# $ sudo apt-get -y update
# $ sudo apt-get -y upgrade
# $ sudo apt-get -y remove ffmpeg
# $ sudo apt-get -y install unzip autoconf automake build-essential libass-dev \
# libgpac-dev libsdl1.2-dev libtheora-dev libtool libva-dev libvdpau-dev \
# libvorbis-dev libx11-dev libxext-dev libxfixes-dev pkg-config texi2html \
# zlib1g-dev libmp3lame-dev
# $ sudo chmod 755 ffmpeg-ext.sh

# After running this, log out and in to apply changes in your ./profile
# (ffmpeg to PATH).

# Notice that we will make and install everything locally in $HOME.
mkdir ~/ffmpeg_sources

# Make yasm. x86-64 Assembler for codecs.
cd ~/ffmpeg_sources
wget http://www.tortall.net/projects/yasm/releases/yasm-1.2.0.tar.gz
tar xzvf yasm-1.2.0.tar.gz
cd yasm-1.2.0
./configure --prefix="$HOME/ffmpeg_build" --bindir="$HOME/bin"
make
make install
make distclean
export "PATH=$PATH:$HOME/bin"

# Make libx264. Chromecast supports h264.
cd ~/ffmpeg_sources
wget http://download.videolan.org/pub/x264/snapshots/last_x264.tar.bz2
tar xjvf last_x264.tar.bz2
cd x264-snapshot*
./configure --prefix="$HOME/ffmpeg_build" --bindir="$HOME/bin" --enable-static
make
make install
make distclean

# Make libfdk-aac. Chromecast supports AAC audio.
cd ~/ffmpeg_sources
wget -O fdk-aac.zip https://github.com/mstorsjo/fdk-aac/zipball/master
unzip fdk-aac.zip
cd mstorsjo-fdk-aac*
autoreconf -fiv
./configure --prefix="$HOME/ffmpeg_build" --disable-shared
make
make install
make distclean

# Make libvpx (Google Webm). Chromecast supports VP8 video.
cd ~/ffmpeg_sources
wget http://webm.googlecode.com/files/libvpx-v1.3.0.tar.bz2
tar xjvf libvpx-v1.3.0.tar.bz2
cd libvpx-v1.3.0
./configure --prefix="$HOME/ffmpeg_build" --disable-examples
make
make install
make clean

# Make ffmpeg.
cd ~/ffmpeg_sources
wget http://ffmpeg.org/releases/ffmpeg-snapshot.tar.bz2
tar xjvf ffmpeg-snapshot.tar.bz2
cd ffmpeg
PKG_CONFIG_PATH="$HOME/ffmpeg_build/lib/pkgconfig"
export PKG_CONFIG_PATH
./configure --prefix="$HOME/ffmpeg_build" \
  --extra-cflags="-I$HOME/ffmpeg_build/include" \
  --extra-ldflags="-L$HOME/ffmpeg_build/lib" --bindir="$HOME/bin" \
  --extra-libs="-ldl" --enable-gpl --enable-libass --enable-libfdk-aac \
  --enable-libmp3lame --enable-libtheora --enable-libvorbis --enable-libvpx \
  --enable-libx264 --enable-nonfree
make
make install
make distclean
hash -r

# Add the newly built and locally installed ffmpeg to PATH
echo "MANPATH_MAP $HOME/bin $HOME/ffmpeg_build/share/man" >> ~/.manpath
. ~/.profile
