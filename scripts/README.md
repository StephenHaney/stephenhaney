run this to build the linux binary:
cargo build --release && cargo build --release --target x86_64-unknown-linux-musl

then copy the binaries out of `target` dir into the main directory of `scripts`, named as:
build_script_x86_linux for cloudflare build
build_script_arm for running on mac

You'll need the linker installed, you can get it through homebrew.
I think it's this:

```
brew install filosottile/musl-cross/musl-cross
```

and then this in your `.cargo/config` file:

```
[target.x86_64-unknown-linux-musl]
linker = "x86_64-linux-musl-gcc"
```

Important to make sure the homebrew bin is in your path (/opt/homebrew/bin for ARM Mac)
