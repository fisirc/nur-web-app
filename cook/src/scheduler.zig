const std = @import("std");
const pconsumer = @import("lib/pconsumer.zig");

const Self = @This();

const ParsedRecipe = struct {
    const SetupInfo = struct {
        const BuildInfo = struct {
            steps: [][]const u8,
        };

        url: []const u8,
        branch: []const u8,
        build: *BuildInfo,
    };

    const RuntimeInfo = struct {
        const Perm = enum {};

        perms: []Perm,
    };

    setup: *SetupInfo,
    runtm: *RuntimeInfo,
};

const EventType = enum {
    build_n_setup,
    run,
};

const EventMsg = union(EventType) {
    build_n_setup: ParsedRecipe.SetupInfo,
    run: ParsedRecipe.RuntimeInfo,
};

pool: std.Thread.Pool,
alloc: std.mem.Allocator,

pub fn init(alloc: std.mem.Allocator) Self {
    var new_pool = std.Thread.Pool{};

    return Self{
        .pool = try std.Thread.Pool.init(&new_pool, .{}),
        .alloc = alloc,
    };
}

pub fn deinit(self: *Self) void {
    self.pool.deinit();
}

fn spinSchedule(self: *Self, msg_queue: *pconsumer.Queue(EventMsg)) void {
    while (msg_queue.pullMsg()) |msg| switch (msg) {
        .build_n_setup => {
            _ = self;
        },
        .run => {},
    };
}

/// ownership of both the scheduler ctx and the queue belongs to caller
pub fn spawnScheduler(self: *Self, msg_queue: *pconsumer.Queue(EventMsg)) !void {
    try std.Thread.spawn(.{}, spinSchedule, .{
        self,
        msg_queue,
    });
}
